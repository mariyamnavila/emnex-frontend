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

export const adminRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Employees", url: "/admin/employees", icon: Users, permission: "employee.view" },
      { title: "Departments", url: "/admin/departments", icon: Building2, permission: "department.view" },
      { title: "Projects", url: "/admin/projects", icon: FolderKanban, permission: "project.view" },
      { title: "Payroll", url: "/admin/payroll", icon: Wallet, permission: "payroll.view" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Roles & Permissions", url: "/admin/roles", icon: Shield, permission: "role.view" },
      { title: "Organization", url: "/admin/organization", icon: Building, anyOf: ["organization.view", "organization.update"] },
      { title: "Audit Logs", url: "/admin/audit-logs", icon: ScrollText, permission: "audit.view" },
      { title: "Profile", url: "/admin/profile", icon: User },
    ],
  },
];

export const managerRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/manager", icon: LayoutDashboard },
    ],
  },
  {
    title: "Work",
    items: [
      { title: "Tasks", url: "/manager/tasks", icon: ListTodo, permission: "task.view" },
      { title: "Submissions", url: "/manager/submissions", icon: ClipboardCheck, permission: "submission.view" },
      { title: "Profile", url: "/manager/profile", icon: User },
    ],
  },
];

export const financeRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/finance", icon: LayoutDashboard },
    ],
  },
  {
    title: "Finance",
    items: [
      { title: "Payroll", url: "/finance/payroll", icon: Wallet, permission: "payroll.view" },
      { title: "Payments", url: "/finance/payments", icon: CreditCard, permission: "payment.view" },
      { title: "Profile", url: "/finance/profile", icon: User },
    ],
  },
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
    items: [
      { title: "My Tasks", url: "/dashboard/tasks", icon: ListTodo, permission: "task.view" },
      { title: "My Submissions", url: "/dashboard/submissions", icon: ClipboardCheck, anyOf: ["submission.view", "submission.create"] },
      { title: "My Payroll", url: "/dashboard/payroll", icon: Wallet, anyOf: ["payroll.view", "payroll.view_own"] },
      { title: "My Payments", url: "/dashboard/payments", icon: CreditCard, anyOf: ["payment.view", "payment.view_own"] },
      { title: "Profile", url: "/dashboard/profile", icon: User },
    ],
  },
];

// Custom (non-system) roles: one permission-filtered management menu that spans
// all the management pages. Items still gate on permissions below, so a custom
// role sees exactly the pages its permissions unlock. Profile points at the
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
        title: "Submissions",
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

// Role → default sidebar structure (controls group ORDER).
// Visibility is filtered by permissions, not by this map.
export const sidebarRoutesByRole: Record<string, SidebarItems> = {
  ADMIN: adminRoutes,
  HR_MANAGER: managerRoutes,
  FINANCE_MANAGER: financeRoutes,
  EMPLOYEE: employeeRoutes,
};

// System roles keep their tailored menus. Custom roles get the management menu
// (when any management permission is present) or the employee menu otherwise.
// permissions === null → /auth/me not loaded yet: assume management for custom
// roles so their menu doesn't flash; the items filter once permissions arrive.
export function getSidebarRoutes(role: string, permissions: string[] | null = null): SidebarItems {
  if (sidebarRoutesByRole[role]) return sidebarRoutesByRole[role];
  if (permissions === null || hasManagementPermission(permissions)) return managementRoutes;
  return employeeRoutes;
}

// Can this user see a nav item? (null permissions = not loaded → show it)
export function canViewItem(item: SidebarItems[number]["items"][number], permissions: string[] | null): boolean {
  if (permissions === null) return true;
  if (!item.permission && !item.anyOf) return true;
  if (item.permission && permissions.includes(item.permission)) return true;
  return Boolean(item.anyOf?.some((p) => permissions.includes(p)));
}

// The first page this user can actually open — used as their "home".
export function firstAccessibleHref(role: string, permissions: string[] | null): string | null {
  for (const group of getSidebarRoutes(role, permissions)) {
    for (const item of group.items) {
      if (canViewItem(item, permissions)) return item.url;
    }
  }
  return null;
}
