import type { MenuItem } from "../types";

export function findMenuItem(items: MenuItem[], menuId: string) {
  return items.find((item) => item.id === menuId) ?? items[0];
}
