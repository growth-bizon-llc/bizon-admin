import type { OrderEvent, OrderStatus, ProductStatus } from "@/lib/api/types";

export const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  archived: "bg-red-100 text-red-800",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  paid: "bg-indigo-100 text-indigo-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-cyan-100 text-cyan-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-orange-100 text-orange-800",
};

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, { event: OrderEvent; label: string; successMessage: string }[]> = {
  pending: [
    { event: "confirm", label: "Confirm", successMessage: "Order confirmed" },
    { event: "cancel", label: "Cancel", successMessage: "Order cancelled" },
  ],
  confirmed: [
    { event: "pay", label: "Mark Paid", successMessage: "Order marked as paid" },
    { event: "cancel", label: "Cancel", successMessage: "Order cancelled" },
  ],
  paid: [
    { event: "process_order", label: "Process", successMessage: "Order is now processing" },
    { event: "refund", label: "Refund", successMessage: "Order refunded" },
  ],
  processing: [{ event: "ship", label: "Ship", successMessage: "Order shipped" }],
  shipped: [{ event: "deliver", label: "Mark Delivered", successMessage: "Order marked as delivered" }],
  delivered: [],
  cancelled: [],
  refunded: [],
};

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
  { value: "MXN", label: "Mexican Peso (MXN)" },
];

export const LOCALE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
];
