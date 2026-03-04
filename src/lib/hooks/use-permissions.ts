"use client";

import { useAuthStore } from "@/lib/stores/auth-store";

export interface Permissions {
  canDeleteProducts: boolean;
  canManageStore: boolean;
  canUpdateOrderStatus: boolean;
  canCreateProducts: boolean;
  canEditProducts: boolean;
  canViewSettings: boolean;
}

export function usePermissions(): Permissions {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  return {
    canDeleteProducts: role === "admin" || role === "owner",
    canManageStore: role === "owner",
    canUpdateOrderStatus: role === "admin" || role === "owner",
    canCreateProducts: !!role,
    canEditProducts: !!role,
    canViewSettings: role === "owner",
  };
}
