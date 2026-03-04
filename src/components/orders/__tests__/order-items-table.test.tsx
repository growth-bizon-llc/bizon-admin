import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import OrderItemsTable from "../order-items-table";
import type { OrderItem } from "@/lib/api/types";

const mockItems: OrderItem[] = [
  {
    id: 1,
    product_id: 1,
    product_variant_id: null,
    product_name: "Widget A",
    variant_name: "",
    sku: "WA-001",
    quantity: 2,
    unit_price: { amount: 10.0, currency: "USD" },
    total: { amount: 20.0, currency: "USD" },
  },
  {
    id: 2,
    product_id: 2,
    product_variant_id: 5,
    product_name: "Widget B",
    variant_name: "Large",
    sku: "WB-LG",
    quantity: 1,
    unit_price: { amount: 30.0, currency: "USD" },
    total: { amount: 30.0, currency: "USD" },
  },
];

describe("OrderItemsTable", () => {
  it("renders product names", () => {
    renderWithProviders(<OrderItemsTable items={mockItems} />);
    expect(screen.getByText("Widget A")).toBeInTheDocument();
    expect(screen.getByText("Widget B")).toBeInTheDocument();
  });

  it("renders variant names", () => {
    renderWithProviders(<OrderItemsTable items={mockItems} />);
    expect(screen.getByText("Large")).toBeInTheDocument();
  });

  it("renders SKUs", () => {
    renderWithProviders(<OrderItemsTable items={mockItems} />);
    expect(screen.getByText("WA-001")).toBeInTheDocument();
    expect(screen.getByText("WB-LG")).toBeInTheDocument();
  });

  it("renders quantities", () => {
    renderWithProviders(<OrderItemsTable items={mockItems} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders unit prices and totals", () => {
    renderWithProviders(<OrderItemsTable items={mockItems} />);
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    // $30.00 appears twice (unit price and total for Widget B since qty=1)
    expect(screen.getAllByText("$30.00")).toHaveLength(2);
  });
});
