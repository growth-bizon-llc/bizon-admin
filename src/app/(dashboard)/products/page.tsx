"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useProducts, useDeleteProduct } from "@/lib/api/hooks/use-products";
import { useCategories } from "@/lib/api/hooks/use-categories";
import { usePermissions } from "@/lib/hooks/use-permissions";
import type { ProductList } from "@/lib/api/types";
import PageHeader from "@/components/ui/page-header";
import DataTable from "@/components/ui/data-table";
import Pagination from "@/components/ui/pagination";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import MoneyDisplay from "@/components/ui/money-display";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import SearchInput from "@/components/ui/search-input";
import Select from "@/components/ui/select";
import { PRODUCT_STATUS_COLORS } from "@/lib/utils/constants";

const columnHelper = createColumnHelper<ProductList>();

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ProductList | null>(null);

  const { data, isLoading } = useProducts({
    page,
    search,
    status: statusFilter || undefined,
    category_id: categoryFilter ? Number(categoryFilter) : undefined,
  });
  const { data: catData } = useCategories();
  const deleteMutation = useDeleteProduct();
  const { canDeleteProducts } = usePermissions();

  const columns = [
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("sku", { header: "SKU" }),
    columnHelper.accessor("base_price", {
      header: "Price",
      cell: (info) => <MoneyDisplay money={info.getValue()} />,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <Badge className={PRODUCT_STATUS_COLORS[info.getValue()]}>
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </Badge>
      ),
    }),
    columnHelper.accessor("category_name", {
      header: "Category",
      cell: (info) => info.getValue() || "—",
    }),
    columnHelper.accessor("quantity", { header: "Qty" }),
    columnHelper.accessor("variants_count", { header: "Variants" }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) =>
        canDeleteProducts ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(info.row.original);
            }}
            className="text-gray-500 hover:text-red-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        ) : null,
    }),
  ];

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Product deleted");
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete product"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Products"
        actions={
          <Button onClick={() => router.push("/products/new")}>
            <PlusIcon className="h-4 w-4 mr-2" /> Add Product
          </Button>
        }
      />

      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="w-64">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search products..." />
        </div>
        <div className="w-40">
          <Select
            options={[
              { value: "draft", label: "Draft" },
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
            ]}
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          />
        </div>
        <div className="w-48">
          <Select
            options={catData?.categories.map((c) => ({ value: String(c.id), label: c.name })) ?? []}
            placeholder="All Categories"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <DataTable
        data={data?.products ?? []}
        columns={columns}
        onRowClick={(row) => router.push(`/products/${row.id}/edit`)}
      />

      {data?.meta && (
        <Pagination currentPage={data.meta.current_page} totalPages={data.meta.total_pages} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
