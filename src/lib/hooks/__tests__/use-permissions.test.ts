import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/lib/stores/auth-store";
import { renderHook } from "@testing-library/react";
import { usePermissions } from "../use-permissions";

describe("usePermissions", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it("grants full permissions to owner", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "owner", store_id: 1 },
      isAuthenticated: true,
    });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.canDeleteProducts).toBe(true);
    expect(result.current.canManageStore).toBe(true);
    expect(result.current.canUpdateOrderStatus).toBe(true);
    expect(result.current.canCreateProducts).toBe(true);
    expect(result.current.canEditProducts).toBe(true);
    expect(result.current.canViewSettings).toBe(true);
  });

  it("grants admin permissions (no store management)", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.canDeleteProducts).toBe(true);
    expect(result.current.canManageStore).toBe(false);
    expect(result.current.canUpdateOrderStatus).toBe(true);
    expect(result.current.canCreateProducts).toBe(true);
    expect(result.current.canViewSettings).toBe(false);
  });

  it("grants limited permissions to staff", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "staff", store_id: 1 },
      isAuthenticated: true,
    });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.canDeleteProducts).toBe(false);
    expect(result.current.canManageStore).toBe(false);
    expect(result.current.canUpdateOrderStatus).toBe(false);
    expect(result.current.canCreateProducts).toBe(true);
    expect(result.current.canEditProducts).toBe(true);
    expect(result.current.canViewSettings).toBe(false);
  });

  it("denies all permissions when no user", () => {
    const { result } = renderHook(() => usePermissions());
    expect(result.current.canDeleteProducts).toBe(false);
    expect(result.current.canManageStore).toBe(false);
    expect(result.current.canCreateProducts).toBe(false);
  });
});
