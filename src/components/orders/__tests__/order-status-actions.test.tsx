import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent, waitFor } from "@/test-utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import OrderStatusActions from "../order-status-actions";
import type { Order } from "@/lib/api/types";

vi.mock("@/lib/api/client", () => ({
  default: {
    patch: vi.fn(),
  },
}));

const makeOrder = (status: Order["status"]): Order => ({
  id: 1,
  order_number: "#1001",
  email: "test@test.com",
  status,
  shipping_address: {},
  billing_address: {},
  notes: "",
  metadata: {},
  placed_at: "2024-01-01",
  paid_at: null,
  shipped_at: null,
  delivered_at: null,
  cancelled_at: null,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  subtotal: { amount: 0, currency: "USD" },
  tax: { amount: 0, currency: "USD" },
  total: { amount: 0, currency: "USD" },
  customer: null,
  items: [],
});

describe("OrderStatusActions", () => {
  it("shows confirm and cancel buttons for pending orders (admin)", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<OrderStatusActions order={makeOrder("pending")} />);
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("shows ship button for processing orders", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "owner", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<OrderStatusActions order={makeOrder("processing")} />);
    expect(screen.getByText("Ship")).toBeInTheDocument();
  });

  it("shows no buttons for delivered orders", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    const { container } = renderWithProviders(<OrderStatusActions order={makeOrder("delivered")} />);
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("shows nothing for staff users", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "staff", store_id: 1 },
      isAuthenticated: true,
    });
    const { container } = renderWithProviders(<OrderStatusActions order={makeOrder("pending")} />);
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("shows process and refund buttons for paid orders", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<OrderStatusActions order={makeOrder("paid")} />);
    expect(screen.getByText("Process")).toBeInTheDocument();
    expect(screen.getByText("Refund")).toBeInTheDocument();
  });

  it("shows mark paid button for confirmed orders", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "owner", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<OrderStatusActions order={makeOrder("confirmed")} />);
    expect(screen.getByText("Mark Paid")).toBeInTheDocument();
  });

  it("shows mark delivered button for shipped orders", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<OrderStatusActions order={makeOrder("shipped")} />);
    expect(screen.getByText("Mark Delivered")).toBeInTheDocument();
  });

  it("opens confirm dialog when action button clicked", async () => {
    const user = userEvent.setup();
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<OrderStatusActions order={makeOrder("pending")} />);
    await user.click(screen.getByText("Confirm"));
    // Dialog should now be open with confirm message
    expect(screen.getByText("Confirm Order")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to confirm this order?")).toBeInTheDocument();
  });

  it("uses danger variant for cancel and refund buttons", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<OrderStatusActions order={makeOrder("pending")} />);
    const cancelBtn = screen.getByText("Cancel");
    expect(cancelBtn.closest("button")).toHaveClass("bg-red-600");
  });

  it("closes confirm dialog on cancel", async () => {
    const user = userEvent.setup();
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    renderWithProviders(<OrderStatusActions order={makeOrder("pending")} />);
    // Open dialog
    await user.click(screen.getByText("Confirm"));
    expect(screen.getByText("Confirm Order")).toBeInTheDocument();

    // Close dialog via cancel button in the dialog
    const cancelButtons = screen.getAllByText("Cancel");
    // The last Cancel is the dialog's cancel button
    const dialogCancel = cancelButtons[cancelButtons.length - 1];
    await user.click(dialogCancel);

    await waitFor(() => {
      expect(screen.queryByText("Confirm Order")).not.toBeInTheDocument();
    });
  });

  it("shows no buttons for refunded orders", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    const { container } = renderWithProviders(<OrderStatusActions order={makeOrder("refunded")} />);
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("shows no buttons for cancelled orders", () => {
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      isAuthenticated: true,
    });
    const { container } = renderWithProviders(<OrderStatusActions order={makeOrder("cancelled")} />);
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });
});
