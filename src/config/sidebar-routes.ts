import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  ListTodo,
  ClipboardCheck,
  Wallet,
  CreditCard,
  Shield,
  ScrollText,
  User,
  Building,
} from "lucide-react";
import type { SidebarItems } from "@/types/sidebar.type";

// Permission-based sidebar: each item declares what it needs.
// Items without a permission are visible to every authenticated user.
// `anyOf` means "any one of these permissions suffices" (e.g. view OR view_own).

// Self-service "My ___" items. Shown to employees AND to any management user who
// can view their own of that resource (view or view_own) — everyone has their own
// tasks/hours/pay, so holding the view permission earns the self-service link.
const MY_WORK_ITEMS: SidebarItems[number]["items"] = [
  { title: "My Tasks", url: "/dashboard/tasks", icon: ListTodo, permission: "task.view_own" },
  { title: "My Work Hours", url: "/dashboard/submissions", icon: ClipboardCheck, permission: "submission.view_own" },
  { title: "My Payroll", url: "/dashboard/payroll", icon: Wallet, permission: "payroll.view_own" },
  { title: "My Payments", url: "/dashboard/payments", icon: CreditCard, permission: "payment.view_own" },
];

export const employeeRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "My Work",
    items: [...MY_WORK_ITEMS, { title: "Profile", url: "/dashboard/profile", icon: User }],
  },
];

// One permission-filtered management menu that spans all the management pages.
// Every role (system or custom) uses it; items gate on permissions below, so a
// user sees exactly the pages their permissions unlock. Profile points at the
// employee area, which any authenticated user can reach.
export const managementRoutes: SidebarItems = [
  {
    title: "Management",
    items: [
      { title: "Employees", url: "/admin/employees", icon: Users, permission: "employee.view" },
      { title: "Departments", url: "/admin/departments", icon: Building2, permission: "department.view" },
      { title: "Projects", url: "/admin/projects", icon: FolderKanban, permission: "project.view" },
      { title: "Tasks", url: "/manager/tasks", icon: ListTodo, permission: "task.view" },
      {
        title: "Work Hours",
        url: "/manager/submissions",
        icon: ClipboardCheck,
        anyOf: ["submission.view", "submission.approve", "submission.reject"],
      },
      { title: "Payroll", url: "/admin/payroll", icon: Wallet, permission: "payroll.view" },
      { title: "Payments", url: "/finance/payments", icon: CreditCard, permission: "payment.view" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Roles & Permissions", url: "/admin/roles", icon: Shield, permission: "role.view" },
      {
        title: "Organization",
        url: "/admin/organization",
        icon: Building,
        anyOf: ["organization.view", "organization.update"],
      },
      { title: "Audit Logs", url: "/admin/audit-logs", icon: ScrollText, permission: "audit.view" },
      { title: "Profile", url: "/dashboard/profile", icon: User },
    ],
  },
];

// Permissions that mean "this is a management role" (everything except the
// pure self-service perms an ordinary employee has).
const MANAGEMENT_PERMS = new Set([
  "employee.view", "employee.create", "employee.update", "employee.delete",
  "department.view", "department.create", "department.update", "department.delete",
  "project.view", "project.create", "project.update", "project.delete",
  "task.create", "task.assign", "task.delete",
  "submission.approve", "submission.reject",
  "payroll.view", "payroll.generate", "payroll.approve", "payroll.reject",
  "payment.view", "payment.create", "payment.refund",
  "role.view", "role.create", "role.update", "role.delete",
  "permission.view", "permission.assign",
  "organization.view", "organization.update",
  "audit.view", "analytics.view",
]);

export function hasManagementPermission(permissions: string[] | null): boolean {
  return Boolean(permissions?.some((p) => MANAGEMENT_PERMS.has(p)));
}

// Built-in (system) roles → the overview/dashboard page each one lands on.
// Custom roles aren't listed; they land on their first accessible page instead.
export const SYSTEM_ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  HR_MANAGER: "/manager",
  FINANCE_MANAGER: "/finance",
  EMPLOYEE: "/dashboard",
};

export function isSystemRole(role: string): boolean {
  return role in SYSTEM_ROLE_HOME;
}

// Routing is permission-based for every role. A user with any management
// permission gets the management menu; a pure self-service user (the EMPLOYEE
// role, or a custom role with no management permission) gets the employee menu.
// System management roles (Admin/HR/Finance) keep a Dashboard link to their own
// overview page. permissions === null → /auth/me not loaded yet: assume
// management so the menu doesn't flash; items filter once permissions arrive.
export function getSidebarRoutes(
  role: string,
  permissions: string[] | null = null,
  isEmployee = false,
): SidebarItems {
  if (role === "EMPLOYEE") return employeeRoutes;
  if (permissions !== null && !hasManagementPermission(permissions)) return employeeRoutes;

  // Management users who ALSO have an employee record (their own work data) get
  // the self-service links; the org owner / admin has none, so skip them. Each
  // item still gates on its endpoint's permission, and empty groups are dropped.
  const myWork = isEmployee ? [{ title: "My Work", items: MY_WORK_ITEMS }] : [];
  const dashboard = SYSTEM_ROLE_HOME[role];
  if (dashboard && dashboard !== "/dashboard") {
    return [
      { title: "Overview", items: [{ title: "Dashboard", url: dashboard, icon: LayoutDashboard }] },
      ...managementRoutes,
      ...myWork,
    ];
  }
  return [...managementRoutes, ...myWork];
}

// Can this user see a nav item? (null permissions = not loaded → show it)
export function canViewItem(item: SidebarItems[number]["items"][number], permissions: string[] | null): boolean {
  if (permissions === null) return true;
  if (!item.permission && !item.anyOf) return true;
  if (item.permission && permissions.includes(item.permission)) return true;
  return Boolean(item.anyOf?.some((p) => permissions.includes(p)));
}

// The first page this user can actually open — used as their "home".
export function firstAccessibleHref(
  role: string,
  permissions: string[] | null,
  isEmployee = false,
): string | null {
  for (const group of getSidebarRoutes(role, permissions, isEmployee)) {
    for (const item of group.items) {
      if (canViewItem(item, permissions)) return item.url;
    }
  }
  return null;
}

// Every page that declares a permission, flattened once. Reuses the same
// permission each sidebar item already carries, so page access and nav
// visibility can never drift apart.
const GUARDED_ROUTES = [...managementRoutes, ...employeeRoutes]
  .flatMap((group) => group.items)
  .map((item) => ({ url: item.url, perms: item.permission ? [item.permission] : (item.anyOf ?? []) }))
  .filter((route) => route.perms.length > 0);

// The permission(s) a path requires — any one suffices — or null for pages with
// no requirement (dashboards, profile). Longest-matching prefix wins so detail
// pages (/admin/projects/[id]) inherit their section's permission.
export function routePermissions(pathname: string): string[] | null {
  let best: { url: string; perms: string[] } | null = null;
  for (const route of GUARDED_ROUTES) {
    if (pathname === route.url || pathname.startsWith(`${route.url}/`)) {
      if (!best || route.url.length > best.url.length) best = route;
    }
  }
  return best ? best.perms : null;
}
