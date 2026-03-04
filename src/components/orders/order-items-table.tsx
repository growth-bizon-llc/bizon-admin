"use client";

import type { OrderItem } from "@/lib/api/types";
import MoneyDisplay from "@/components/ui/money-display";

interface OrderItemsTableProps {
  items: OrderItem[];
}

export default function OrderItemsTable({ items }: OrderItemsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-sm text-gray-900">{item.product_name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{item.variant_name || "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{item.sku || "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-900 text-right">
                <MoneyDisplay money={item.unit_price} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                <MoneyDisplay money={item.total} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
