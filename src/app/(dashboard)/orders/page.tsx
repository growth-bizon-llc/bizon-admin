"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import { useOrders } from "@/lib/api/hooks/use-orders";
import type { OrderList } from "@/lib/api/types";
import PageHeader from "@/components/ui/page-header";
import DataTable from "@/components/ui/data-table";
import Pagination from "@/components/ui/pagination";
import StatusBadge from "@/components/ui/status-badge";
import MoneyDisplay from "@/components/ui/money-display";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Select from "@/components/ui/select";
import { formatDate } from "@/lib/utils/format-date";

const columnHelper = createColumnHelper<OrderList>();

const columns = [
  columnHelper.accessor("order_number", { header: "Order" }),
  columnHelper.accessor("customer_name", {
    header: "Customer",
    cell: (info) => info.getValue() || info.row.original.email,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("items_count", { header: "Items" }),
  columnHelper.accessor("total", {
    header: "Total",
    cell: (info) => <MoneyDisplay money={info.getValue()} />,
  }),
  columnHelper.accessor("created_at", {
    header: "Date",
    cell: (info) => formatDate(info.getValue()),
  }),
];

export default function OrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useOrders({
    page,
    status: statusFilter || undefined,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Orders" />

      <div className="mb-4 w-48">
        <Select
          options={[
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "paid", label: "Paid" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
            { value: "refunded", label: "Refunded" },
          ]}
          placeholder="All Statuses"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <DataTable
        data={data?.orders ?? []}
        columns={columns}
        onRowClick={(row) => router.push(`/orders/${row.id}`)}
      />

      {data?.meta && (
        <Pagination
          currentPage={data.meta.current_page}
          totalPages={data.meta.total_pages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
