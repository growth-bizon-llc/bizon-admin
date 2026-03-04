import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent, waitFor } from "@/test-utils";
import SearchInput from "../search-input";

describe("SearchInput", () => {
  it("renders with placeholder", () => {
    renderWithProviders(<SearchInput value="" onChange={vi.fn()} placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("shows current value", () => {
    renderWithProviders(<SearchInput value="hello" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
  });

  it("debounces onChange calls", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<SearchInput value="" onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "test");

    // Should not call immediately
    expect(onChange).not.toHaveBeenCalled();

    // Wait for debounce
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("test");
    }, { timeout: 500 });
  });
});
