export type MenuGroup = "dashboard" | "product" | "facility" | "front";

export interface MenuItem {
  id: string;
  label: string;
  group: MenuGroup;
  description: string;
}
