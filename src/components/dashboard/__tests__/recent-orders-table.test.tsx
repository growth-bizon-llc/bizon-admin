import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import RecentOrdersTable from "../recent-orders-table";
import type { OrderList } from "@/lib/api/types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
  usePathname: () => "/dashboard",
}));

const mockOrders: OrderList[] = [
  {
    id: 1,
    order_number: "#1001",
    email: "john@test.com",
    status: "pending",
    created_at: "2024-06-15T10:00:00Z",
    total: { amount: 50.0, currency: "USD" },
    items_count: 2,
    customer_name: "John Doe",
  },
  {
    id: 2,
    order_number: "#1002",
    email: "jane@test.com",
    status: "delivered",
    created_at: "2024-06-14T10:00:00Z",
    total: { amount: 75.0, currency: "USD" },
    items_count: 3,
    customer_name: null,
  },
];

describe("RecentOrdersTable", () => {
  it("renders order numbers", () => {
    renderWithProviders(<RecentOrdersTable orders={mockOrders} />);
    expect(screen.getByText("#1001")).toBeInTheDocument();
    expect(screen.getByText("#1002")).toBeInTheDocument();
  });

  it("renders customer name or email", () => {
    renderWithProviders(<RecentOrdersTable orders={mockOrders} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@test.com")).toBeInTheDocument();
  });

  it("renders status badges", () => {
    renderWithProviders(<RecentOrdersTable orders={mockOrders} />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("renders totals", () => {
    renderWithProviders(<RecentOrdersTable orders={mockOrders} />);
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("$75.00")).toBeInTheDocument();
  });

  it("navigates to order detail on row click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecentOrdersTable orders={mockOrders} />);
    await user.click(screen.getByText("#1001"));
    expect(mockPush).toHaveBeenCalledWith("/orders/1");
  });
});
