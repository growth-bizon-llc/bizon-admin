import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import OrderInfoCard from "../order-info-card";
import type { Order } from "@/lib/api/types";

const mockOrder: Order = {
  id: 1,
  order_number: "#1001",
  email: "john@test.com",
  status: "paid",
  shipping_address: { line1: "123 Main St", line2: "Apt 4B", city: "Springfield", state: "IL", zip: "62701", country: "US" },
  billing_address: { line1: "456 Oak Ave", city: "Chicago", state: "IL", zip: "60601", country: "US" },
  notes: "Leave at door",
  metadata: {},
  placed_at: "2024-06-15T10:00:00Z",
  paid_at: "2024-06-15T11:00:00Z",
  shipped_at: null,
  delivered_at: null,
  cancelled_at: null,
  created_at: "2024-06-15T10:00:00Z",
  updated_at: "2024-06-15T11:00:00Z",
  subtotal: { amount: 45.0, currency: "USD" },
  tax: { amount: 5.0, currency: "USD" },
  total: { amount: 50.0, currency: "USD" },
  customer: { id: 1, email: "john@test.com", first_name: "John", last_name: "Doe" },
  items: [],
};

describe("OrderInfoCard", () => {
  it("renders order number", () => {
    renderWithProviders(<OrderInfoCard order={mockOrder} />);
    expect(screen.getByText("Order #1001")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    renderWithProviders(<OrderInfoCard order={mockOrder} />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders customer name", () => {
    renderWithProviders(<OrderInfoCard order={mockOrder} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders email when no customer", () => {
    const orderNoCustomer = { ...mockOrder, customer: null };
    renderWithProviders(<OrderInfoCard order={orderNoCustomer} />);
    // Email appears at least once in the card (as customer name fallback + email display)
    expect(screen.getAllByText("john@test.com").length).toBeGreaterThanOrEqual(1);
  });

  it("renders shipping address with line2", () => {
    renderWithProviders(<OrderInfoCard order={mockOrder} />);
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("Apt 4B")).toBeInTheDocument();
    // "US" appears twice (shipping and billing)
    expect(screen.getAllByText("US")).toHaveLength(2);
  });

  it("renders billing address", () => {
    renderWithProviders(<OrderInfoCard order={mockOrder} />);
    expect(screen.getByText("456 Oak Ave")).toBeInTheDocument();
    expect(screen.getByText("Billing Address")).toBeInTheDocument();
  });

  it("renders money totals", () => {
    renderWithProviders(<OrderInfoCard order={mockOrder} />);
    expect(screen.getByText("$45.00")).toBeInTheDocument();
    expect(screen.getByText("$5.00")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
  });

  it("renders notes", () => {
    renderWithProviders(<OrderInfoCard order={mockOrder} />);
    expect(screen.getByText("Leave at door")).toBeInTheDocument();
  });

  it("renders paid date", () => {
    renderWithProviders(<OrderInfoCard order={mockOrder} />);
    expect(screen.getByText("Paid:")).toBeInTheDocument();
  });

  it("does not render shipped/delivered/cancelled dates when null", () => {
    renderWithProviders(<OrderInfoCard order={mockOrder} />);
    expect(screen.queryByText("Shipped:")).not.toBeInTheDocument();
    expect(screen.queryByText("Delivered:")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancelled:")).not.toBeInTheDocument();
  });

  it("renders shipped date when present", () => {
    const shippedOrder = { ...mockOrder, shipped_at: "2024-06-16T10:00:00Z" };
    renderWithProviders(<OrderInfoCard order={shippedOrder} />);
    expect(screen.getByText("Shipped:")).toBeInTheDocument();
  });

  it("renders delivered date when present", () => {
    const deliveredOrder = { ...mockOrder, delivered_at: "2024-06-17T10:00:00Z" };
    renderWithProviders(<OrderInfoCard order={deliveredOrder} />);
    expect(screen.getByText("Delivered:")).toBeInTheDocument();
  });

  it("renders cancelled date when present", () => {
    const cancelledOrder = { ...mockOrder, cancelled_at: "2024-06-17T10:00:00Z" };
    renderWithProviders(<OrderInfoCard order={cancelledOrder} />);
    expect(screen.getByText("Cancelled:")).toBeInTheDocument();
  });

  it("does not render notes section when no notes", () => {
    const orderNoNotes = { ...mockOrder, notes: "" };
    renderWithProviders(<OrderInfoCard order={orderNoNotes} />);
    expect(screen.queryByText("Notes")).not.toBeInTheDocument();
  });

  it("does not render address when empty", () => {
    const orderNoAddress = { ...mockOrder, shipping_address: {}, billing_address: {} };
    renderWithProviders(<OrderInfoCard order={orderNoAddress} />);
    expect(screen.queryByText("Shipping Address")).not.toBeInTheDocument();
    expect(screen.queryByText("Billing Address")).not.toBeInTheDocument();
  });

  it("does not render address when null", () => {
    const orderNullAddress = { ...mockOrder, shipping_address: null as unknown as Record<string, string>, billing_address: null as unknown as Record<string, string> };
    renderWithProviders(<OrderInfoCard order={orderNullAddress} />);
    expect(screen.queryByText("Shipping Address")).not.toBeInTheDocument();
  });
});
