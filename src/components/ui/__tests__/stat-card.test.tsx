import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import StatCard from "../stat-card";

describe("StatCard", () => {
  it("renders label and value", () => {
    renderWithProviders(
      <StatCard label="Products" value={42} icon={<span>icon</span>} />
    );
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders string value", () => {
    renderWithProviders(
      <StatCard label="Revenue" value="$1,234" icon={<span>$</span>} />
    );
    expect(screen.getByText("$1,234")).toBeInTheDocument();
  });

  it("renders icon", () => {
    renderWithProviders(
      <StatCard label="Test" value={0} icon={<span data-testid="icon">icon</span>} />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
