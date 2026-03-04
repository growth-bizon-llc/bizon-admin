import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import VariantForm from "../variant-form";
import type { Variant } from "@/lib/api/types";

const mockVariant: Variant = {
  id: 1,
  name: "Large",
  sku: "WG-LG",
  price: { amount: 29.99, currency: "USD" },
  compare_at_price: { amount: 39.99, currency: "USD" },
  track_inventory: true,
  quantity: 50,
  position: 0,
  options: { size: "L", color: "Red" },
  active: true,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
};

describe("VariantForm", () => {
  it("renders create form with default values", () => {
    renderWithProviders(
      <VariantForm onSubmit={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("SKU")).toBeInTheDocument();
    expect(screen.getByLabelText("Price ($)")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity")).toBeInTheDocument();
    expect(screen.getByText("Add Variant")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders edit form with pre-filled data", () => {
    renderWithProviders(
      <VariantForm variant={mockVariant} onSubmit={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByDisplayValue("Large")).toBeInTheDocument();
    expect(screen.getByDisplayValue("WG-LG")).toBeInTheDocument();
    expect(screen.getByText("Update Variant")).toBeInTheDocument();
  });

  it("renders options from variant", () => {
    renderWithProviders(
      <VariantForm variant={mockVariant} onSubmit={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByDisplayValue("size")).toBeInTheDocument();
    expect(screen.getByDisplayValue("L")).toBeInTheDocument();
    expect(screen.getByDisplayValue("color")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Red")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderWithProviders(
      <VariantForm onSubmit={vi.fn()} onCancel={onCancel} />
    );
    await user.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("adds option entry", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <VariantForm onSubmit={vi.fn()} onCancel={vi.fn()} />
    );
    const initialKeys = screen.getAllByPlaceholderText("Key (e.g. Size)");
    await user.click(screen.getByText("Add Option"));
    const afterKeys = screen.getAllByPlaceholderText("Key (e.g. Size)");
    expect(afterKeys.length).toBe(initialKeys.length + 1);
  });

  it("renders loading state on submit button", () => {
    renderWithProviders(
      <VariantForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={true} />
    );
    // Loading spinner should be visible in the button
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("removes option entry", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <VariantForm variant={mockVariant} onSubmit={vi.fn()} onCancel={vi.fn()} />
    );
    // Initially has 2 option entries (size and color)
    const keysBefore = screen.getAllByPlaceholderText("Key (e.g. Size)");
    expect(keysBefore).toHaveLength(2);

    // Click first remove button
    const removeButtons = screen.getAllByRole("button").filter(
      btn => btn.querySelector("svg") && btn.className.includes("text-red-500")
    );
    await user.click(removeButtons[0]);

    const keysAfter = screen.getAllByPlaceholderText("Key (e.g. Size)");
    expect(keysAfter).toHaveLength(1);
  });
});
