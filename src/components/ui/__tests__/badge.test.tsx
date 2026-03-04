import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import Badge from "../badge";

describe("Badge", () => {
  it("renders children", () => {
    renderWithProviders(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    renderWithProviders(<Badge className="bg-green-100">Active</Badge>);
    expect(screen.getByText("Active").className).toContain("bg-green-100");
  });

  it("has pill styling", () => {
    renderWithProviders(<Badge>Test</Badge>);
    expect(screen.getByText("Test").className).toContain("rounded-full");
  });
});
