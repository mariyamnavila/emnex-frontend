"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
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

// The full user returned by /auth/me (includes role + organization objects)
export interface MeUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  organizationId: string;
  status: string;
  mustChangePassword: boolean;
  role: { id: string; name: string; description: string | null };
  organization: { id: string; name: string; slug: string };
}

// Where each role lands after logging in
// Custom/unknown roles default to /dashboard (safe entry point)
export const getHomePath = (role: string): string => {
  if (role === "ADMIN") return "/admin";
  if (role === "HR_MANAGER") return "/manager";
  if (role === "FINANCE_MANAGER") return "/finance";
  return "/dashboard";
};

const errorMessage = (error: Error, fallback: string) =>
  error instanceof ApiError ? error.message : fallback;

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LoginFormValues) =>
      api.post<{ accessToken: string; user: AuthUser }>("/auth/login", values),
    onSuccess: ({ data }) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      toast.success(`Welcome back, ${data.user.name}`);
      router.push(getHomePath(data.user.role));
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
      queryClient.setQueryData(["auth", "me"], data.user);
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
    retry: false,
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out");
      router.push("/login");
    },
    onError: (error) => {
      queryClient.clear();
      toast.error(errorMessage(error, "Logout failed"));
      router.push("/login");
    },
  });
}
