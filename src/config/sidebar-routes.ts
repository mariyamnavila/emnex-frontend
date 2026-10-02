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

// Role → default sidebar structure (controls group ORDER).
// Visibility is filtered by permissions, not by this map.
export const sidebarRoutesByRole: Record<string, SidebarItems> = {
  ADMIN: adminRoutes,
  HR_MANAGER: managerRoutes,
  FINANCE_MANAGER: financeRoutes,
  EMPLOYEE: employeeRoutes,
};

export function getSidebarRoutes(role: string): SidebarItems {
  return sidebarRoutesByRole[role] ?? employeeRoutes;
}
