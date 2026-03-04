import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import DashboardLayout from "../dashboard-layout";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/dashboard",
}));

describe("DashboardLayout", () => {
  it("renders children content", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders sidebar and header", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(
      <DashboardLayout>
        <div>Main</div>
      </DashboardLayout>
    );
    // Sidebar renders both mobile and desktop copies
    expect(screen.getAllByText("Bizon Admin").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
  });

  it("toggles sidebar when menu button clicked", async () => {
    const user = userEvent.setup();
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    // Click the hamburger menu button
    const menuButton = screen.getByLabelText("Open menu");
    await user.click(menuButton);

    // The mobile sidebar should now have translate-x-0 class
    const mobileSidebar = document.querySelector(".fixed.inset-y-0.left-0");
    expect(mobileSidebar).toHaveClass("translate-x-0");
  });
});
