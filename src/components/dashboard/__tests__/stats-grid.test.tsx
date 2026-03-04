import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import StatsGrid from "../stats-grid";
import type { DashboardData, OrderStatus } from "@/lib/api/types";

const mockData: DashboardData = {
  total_products: 42,
  total_orders: 100,
  total_customers: 50,
  total_revenue_cents: 123456,
  orders_by_status: { pending: 5, confirmed: 3, paid: 10, processing: 2, shipped: 5, delivered: 70, cancelled: 3, refunded: 2 } as Record<OrderStatus, number>,
  recent_orders: [],
};

describe("StatsGrid", () => {
  it("renders product count", () => {
    renderWithProviders(<StatsGrid data={mockData} />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("renders order count", () => {
    renderWithProviders(<StatsGrid data={mockData} />);
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
  });

  it("renders customer count", () => {
    renderWithProviders(<StatsGrid data={mockData} />);
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("Customers")).toBeInTheDocument();
  });

  it("renders formatted revenue", () => {
    renderWithProviders(<StatsGrid data={mockData} />);
    expect(screen.getByText("$1,234.56")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });
});
