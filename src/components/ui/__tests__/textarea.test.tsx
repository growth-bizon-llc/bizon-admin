import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import Textarea from "../textarea";

describe("Textarea", () => {
  it("renders with label", () => {
    renderWithProviders(<Textarea id="test" label="Description" />);
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("shows error message", () => {
    renderWithProviders(<Textarea id="test" error="Too short" />);
    expect(screen.getByText("Too short")).toBeInTheDocument();
  });

  it("applies error styling", () => {
    renderWithProviders(<Textarea id="test" error="Error" />);
    expect(screen.getByRole("textbox").className).toContain("border-red-300");
  });
});
