import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent, waitFor } from "@/test-utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import Sidebar from "../sidebar";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/dashboard",
}));

vi.mock("@/lib/api/client", () => ({
  default: {
    delete: vi.fn().mockResolvedValue({ data: { message: "Logged out successfully." } }),
  },
}));

describe("Sidebar", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it("renders navigation items", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "staff", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<Sidebar open={true} onClose={vi.fn()} />);
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Products").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Categories").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Orders").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Customers").length).toBeGreaterThan(0);
  });

  it("shows Settings link for owner", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "owner", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<Sidebar open={true} onClose={vi.fn()} />);
    expect(screen.getAllByText("Settings").length).toBeGreaterThan(0);
  });

  it("hides Settings link for staff", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "staff", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<Sidebar open={true} onClose={vi.fn()} />);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("hides Settings link for admin", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<Sidebar open={true} onClose={vi.fn()} />);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("renders logout button", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "staff", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<Sidebar open={true} onClose={vi.fn()} />);
    expect(screen.getAllByText("Logout").length).toBeGreaterThan(0);
  });

  it("calls logout and redirects when logout clicked", async () => {
    const user = userEvent.setup();
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "staff", store_id: 1 },
      isAuthenticated: true,
      token: "test-token",
    });

    // Mock window.location
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...originalLocation, href: "" },
    });

    renderWithProviders(<Sidebar open={true} onClose={vi.fn()} />);
    const logoutButtons = screen.getAllByText("Logout");
    await user.click(logoutButtons[0]);

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
    expect(window.location.href).toBe("/login");

    // Restore
    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });

  it("calls onClose when nav link is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "staff", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<Sidebar open={true} onClose={onClose} />);
    const productLinks = screen.getAllByText("Products");
    await user.click(productLinks[0]);
    expect(onClose).toHaveBeenCalled();
  });
});
