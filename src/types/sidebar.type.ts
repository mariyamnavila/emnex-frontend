import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  /** Permission required to see this item (omit = visible to all authenticated users) */
  permission?: string;
  /** Alternative permissions — any one suffices */
  anyOf?: string[];
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export type SidebarItems = SidebarGroup[];
