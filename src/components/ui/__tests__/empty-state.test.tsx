import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import EmptyState from "../empty-state";

describe("EmptyState", () => {
  it("renders message", () => {
    renderWithProviders(<EmptyState message="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("renders action button when provided", () => {
    const onAction = vi.fn();
    renderWithProviders(
      <EmptyState message="No items" actionLabel="Add Item" onAction={onAction} />
    );
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("calls onAction when button clicked", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderWithProviders(
      <EmptyState message="No items" actionLabel="Add" onAction={onAction} />
    );
    await user.click(screen.getByText("Add"));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("does not render action without both label and handler", () => {
    renderWithProviders(<EmptyState message="Empty" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
