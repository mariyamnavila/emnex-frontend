"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError, errorMessage } from "@/lib/api";
import type { ChangePasswordValues } from "@/validation/auth.validation";
import { useSession } from "@/providers/session.provider";
import type {
  LoginFormValues,
  RegisterFormValues,
} from "@/validation/auth.validation";

// The user object returned by /auth/login and /auth/register
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  mustChangePassword: boolean;
}

// The full user returned by /auth/me (includes role + organization + permissions)
export interface MeUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  organizationId: string;
  status: string;
  mustChangePassword: boolean;
  authProvider: "CREDENTIAL" | "GOOGLE";
  emailVerified: boolean;
  createdAt: string;
  role: { id: string; name: string; description: string | null };
  organization: { id: string; name: string; slug: string };
  permissions: string[];
}

// Where each role lands after logging in
// Custom/unknown roles default to /dashboard (safe entry point)
export const getHomePath = (role: string): string => {
  if (role === "ADMIN") return "/admin";
  if (role === "HR_MANAGER") return "/manager";
  if (role === "FINANCE_MANAGER") return "/finance";
  return "/dashboard";
};

// Only these mean "logged out" (no/expired session, blocked or terminated user).
// Network errors, 429 and 5xx must NOT log the user out.
export const isSessionInvalid = (error: Error | null): boolean =>
  error instanceof ApiError &&
  (error.statusCode === 401 || error.statusCode === 403);

// Page to open after login: the ?redirectTo= set by proxy.ts, else the role home.
// Only same-site paths are allowed ("/x", never "//evil.com" or "/\evil.com").
// If redirectTo belongs to another role, proxy.ts bounces to the right home.
const getPostLoginPath = (role: string): string => {
  const redirectTo = new URLSearchParams(window.location.search).get("redirectTo");
  if (redirectTo && /^\/(?![/\\])/.test(redirectTo)) return redirectTo;
  return getHomePath(role);
};

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LoginFormValues) =>
      api.post<{ accessToken: string; user: AuthUser }>("/auth/login", values),
    onSuccess: ({ data }) => {
      // Login returns a slimmer user than /auth/me (no permissions, role is a string),
      // so drop any cached user and let the guards fetch the full profile.
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      toast.success(`Welcome back, ${data.user.name}`);
      router.push(getPostLoginPath(data.user.role));
    },
    onError: (error) => toast.error(errorMessage(error, "Login failed")),
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      api.post<{ accessToken: string; user: AuthUser }>("/auth/register", values),
    onSuccess: ({ data }) => {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      toast.success("Organization created successfully");
      router.push(getHomePath(data.user.role));
    },
    onError: (error) => toast.error(errorMessage(error, "Registration failed")),
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await api.get<MeUser>("/auth/me");
      return data;
    },
    // Profile/permissions rarely change, and /auth/* is rate limited
    // (20 req / 15 min) — don't refetch on every page change.
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// /auth/me once loaded, the server-decoded JWT until then (instant first paint)
export function useCurrentUser() {
  const session = useSession();
  const { data: me } = useGetMe();

  return {
    id: me?.id ?? session?.userId ?? null,
    name: me?.name ?? session?.name ?? "",
    email: me?.email ?? session?.email ?? "",
    role: me?.role.name ?? session?.role ?? "",
    avatar: me?.avatar ?? null,
    organizationName: me?.organization.name ?? null,
    /** null until /auth/me answers */
    permissions: me?.permissions ?? null,
  };
}

/** `can("payroll.approve")` — false until /auth/me answers */
export function useCan() {
  const { data: me } = useGetMe();
  return (permission: string) => me?.permissions.includes(permission) ?? false;
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => toast.success("Logged out"),
    onError: (error) => toast.error(errorMessage(error, "Logout failed")),
    // Success or not, the user wants out: leave and forget all cached data
    onSettled: () => {
      router.replace("/login");
      queryClient.clear();
    },
  });
}

// The server signs out other sessions and re-issues this one's cookies
export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ChangePasswordValues) =>
      api.post("/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password changed — you've been signed out on other devices");
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't change your password")),
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("avatar", file);
      return api.post<{ avatar: string }>("/auth/upload-avatar", form);
    },
    onSuccess: ({ data }) => {
      queryClient.setQueryData<MeUser>(["auth", "me"], (me) => (me ? { ...me, avatar: data.avatar } : me));
      toast.success("Profile photo updated");
    },
    onError: (error) => toast.error(errorMessage(error, "Couldn't upload your photo")),
  });
}
