import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import MoneyDisplay from "../money-display";

describe("MoneyDisplay", () => {
  it("formats and displays money", () => {
    renderWithProviders(<MoneyDisplay money={{ amount: 25.0, currency: "USD" }} />);
    expect(screen.getByText("$25.00")).toBeInTheDocument();
  });

  it("handles null money", () => {
    renderWithProviders(<MoneyDisplay money={null} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    renderWithProviders(
      <MoneyDisplay money={{ amount: 10, currency: "USD" }} className="font-bold" />
    );
    expect(screen.getByText("$10.00").className).toContain("font-bold");
  });
});
