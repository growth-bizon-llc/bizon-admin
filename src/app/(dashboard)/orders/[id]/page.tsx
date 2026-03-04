"use client";

import { useParams } from "next/navigation";
import { useOrder } from "@/lib/api/hooks/use-orders";
import PageHeader from "@/components/ui/page-header";
import LoadingSpinner from "@/components/ui/loading-spinner";
import OrderInfoCard from "@/components/orders/order-info-card";
import OrderItemsTable from "@/components/orders/order-items-table";
import OrderStatusActions from "@/components/orders/order-status-actions";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error || !order) {
    return <p className="text-red-600">Failed to load order.</p>;
  }

  return (
    <div>
      <PageHeader
        title={`Order ${order.order_number}`}
        actions={<OrderStatusActions order={order} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
            <OrderItemsTable items={order.items} />
          </div>
        </div>
        <div>
          <OrderInfoCard order={order} />
        </div>
      </div>
    </div>
  );
}
