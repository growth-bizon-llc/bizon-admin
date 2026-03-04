"use client";

import type { Order } from "@/lib/api/types";
import { formatDateTime } from "@/lib/utils/format-date";
import { useStore } from "@/lib/api/hooks/use-store";
import MoneyDisplay from "@/components/ui/money-display";
import StatusBadge from "@/components/ui/status-badge";

interface OrderInfoCardProps {
  order: Order;
}

function AddressBlock({ label, address }: { label: string; address: Record<string, string> | null }) {
  if (!address || Object.keys(address).length === 0) return null;
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-1">{label}</h4>
      <div className="text-sm text-gray-600">
        {address.line1 && <p>{address.line1}</p>}
        {address.line2 && <p>{address.line2}</p>}
        <p>
          {[address.city, address.state, address.zip].filter(Boolean).join(", ")}
        </p>
        {address.country && <p>{address.country}</p>}
      </div>
    </div>
  );
}

export default function OrderInfoCard({ order }: OrderInfoCardProps) {
  const { data: store } = useStore();
  const taxRate = store?.tax_rate ?? 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Order {order.order_number}</h2>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Customer:</span>
          <p className="font-medium text-gray-900">
            {order.customer
              ? `${order.customer.first_name} ${order.customer.last_name}`
              : order.email}
          </p>
          <p className="text-gray-500">{order.email}</p>
        </div>
        <div>
          <span className="text-gray-500">Placed:</span>
          <p className="text-gray-900">{formatDateTime(order.placed_at || order.created_at)}</p>
        </div>
        {order.paid_at && (
          <div>
            <span className="text-gray-500">Paid:</span>
            <p className="text-gray-900">{formatDateTime(order.paid_at)}</p>
          </div>
        )}
        {order.shipped_at && (
          <div>
            <span className="text-gray-500">Shipped:</span>
            <p className="text-gray-900">{formatDateTime(order.shipped_at)}</p>
          </div>
        )}
        {order.delivered_at && (
          <div>
            <span className="text-gray-500">Delivered:</span>
            <p className="text-gray-900">{formatDateTime(order.delivered_at)}</p>
          </div>
        )}
        {order.cancelled_at && (
          <div>
            <span className="text-gray-500">Cancelled:</span>
            <p className="text-gray-900">{formatDateTime(order.cancelled_at)}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AddressBlock label="Shipping Address" address={order.shipping_address} />
        <AddressBlock label="Billing Address" address={order.billing_address} />
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <MoneyDisplay money={order.subtotal} className="text-gray-900" />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tax{taxRate > 0 ? ` (${taxRate}%)` : ""}</span>
          <MoneyDisplay money={order.tax} className="text-gray-900" />
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-gray-900">Total</span>
          <MoneyDisplay money={order.total} className="text-gray-900" />
        </div>
      </div>

      {order.notes && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
          <p className="text-sm text-gray-600">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
