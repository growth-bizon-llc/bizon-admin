import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import LoadingSpinner from "../loading-spinner";

describe("LoadingSpinner", () => {
  it("renders with status role", () => {
    renderWithProviders(<LoadingSpinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has aria-label", () => {
    renderWithProviders(<LoadingSpinner />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    renderWithProviders(<LoadingSpinner className="h-8 w-8" />);
    const svg = screen.getByRole("status");
    expect(svg.getAttribute("class")).toContain("h-8");
  });
});
