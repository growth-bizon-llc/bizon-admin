import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import StatusBadge from "../status-badge";

describe("StatusBadge", () => {
  it("renders status text capitalized", () => {
    renderWithProviders(<StatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("applies correct color for confirmed", () => {
    renderWithProviders(<StatusBadge status="confirmed" />);
    const badge = screen.getByText("Confirmed");
    expect(badge.className).toContain("bg-blue-100");
  });

  it("applies correct color for delivered", () => {
    renderWithProviders(<StatusBadge status="delivered" />);
    const badge = screen.getByText("Delivered");
    expect(badge.className).toContain("bg-green-100");
  });

  it("applies correct color for cancelled", () => {
    renderWithProviders(<StatusBadge status="cancelled" />);
    const badge = screen.getByText("Cancelled");
    expect(badge.className).toContain("bg-red-100");
  });
});
