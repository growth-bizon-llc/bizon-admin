import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import Header from "../header";

describe("Header", () => {
  it("renders menu button", () => {
    renderWithProviders(<Header onMenuClick={vi.fn()} />);
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
  });

  it("calls onMenuClick when hamburger clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<Header onMenuClick={onClick} />);
    await user.click(screen.getByLabelText("Open menu"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders user email and role", () => {
    useAuthStore.setState({
      user: { id: 1, email: "admin@test.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<Header onMenuClick={vi.fn()} />);
    expect(screen.getByText("admin@test.com")).toBeInTheDocument();
    expect(screen.getByText("(admin)")).toBeInTheDocument();
  });

  it("does not render user info when not logged in", () => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
    renderWithProviders(<Header onMenuClick={vi.fn()} />);
    expect(screen.queryByText("admin@test.com")).not.toBeInTheDocument();
  });
});
