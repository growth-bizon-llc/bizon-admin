"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useCustomers } from "@/lib/api/hooks/use-customers";
import type { Customer } from "@/lib/api/types";
import PageHeader from "@/components/ui/page-header";
import DataTable from "@/components/ui/data-table";
import Pagination from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils/format-date";

const columnHelper = createColumnHelper<Customer>();

const columns = [
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("first_name", { header: "First Name" }),
  columnHelper.accessor("last_name", { header: "Last Name" }),
  columnHelper.accessor("orders_count", { header: "Orders" }),
  columnHelper.accessor("accepts_marketing", {
    header: "Marketing",
    cell: (info) =>
      info.getValue() ? (
        <CheckCircleIcon className="h-5 w-5 text-green-500" />
      ) : (
        <XCircleIcon className="h-5 w-5 text-gray-400" />
      ),
  }),
  columnHelper.accessor("created_at", {
    header: "Joined",
    cell: (info) => formatDate(info.getValue()),
  }),
];

export default function CustomersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useCustomers({ page, search });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Customers" />

      <div className="mb-4 max-w-sm">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by email..."
        />
      </div>

      <DataTable
        data={data?.customers ?? []}
        columns={columns}
        onRowClick={(row) => router.push(`/customers/${row.id}`)}
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
