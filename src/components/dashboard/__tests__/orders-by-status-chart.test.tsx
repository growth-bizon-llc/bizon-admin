import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import OrdersByStatusChart from "../orders-by-status-chart";
import type { OrderStatus } from "@/lib/api/types";

// Mock recharts to avoid canvas rendering issues in jsdom
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

const mockData: Record<OrderStatus, number> = {
  pending: 5,
  confirmed: 3,
  paid: 8,
  processing: 2,
  shipped: 4,
  delivered: 10,
  cancelled: 1,
  refunded: 0,
};

describe("OrdersByStatusChart", () => {
  it("renders chart title", () => {
    renderWithProviders(<OrdersByStatusChart data={mockData} />);
    expect(screen.getByText("Orders by Status")).toBeInTheDocument();
  });

  it("renders bar chart component", () => {
    renderWithProviders(<OrdersByStatusChart data={mockData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("renders chart elements", () => {
    renderWithProviders(<OrdersByStatusChart data={mockData} />);
    expect(screen.getByTestId("bar")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
  });
});
