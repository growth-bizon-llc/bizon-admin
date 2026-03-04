import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import Toggle from "../toggle";

describe("Toggle", () => {
  it("renders label", () => {
    renderWithProviders(<Toggle enabled={false} onChange={vi.fn()} label="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders description", () => {
    renderWithProviders(<Toggle enabled={false} onChange={vi.fn()} description="Enable this feature" />);
    expect(screen.getByText("Enable this feature")).toBeInTheDocument();
  });

  it("renders in enabled state", () => {
    renderWithProviders(<Toggle enabled={true} onChange={vi.fn()} label="Test" />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toBeInTheDocument();
  });

  it("calls onChange when toggled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<Toggle enabled={false} onChange={onChange} label="Toggle" />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
