import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import Input from "../input";

describe("Input", () => {
  it("renders with label", () => {
    renderWithProviders(<Input id="test" label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders without label", () => {
    renderWithProviders(<Input id="test" placeholder="Enter value" />);
    expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument();
  });

  it("shows error message", () => {
    renderWithProviders(<Input id="test" error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("applies error border styling", () => {
    renderWithProviders(<Input id="test" error="Error" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("border-red-300");
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<Input id="test" onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLInputElement | null };
    renderWithProviders(<Input id="test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
