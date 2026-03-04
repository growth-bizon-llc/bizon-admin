"use client";

import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/lib/api/hooks/use-categories";
import { usePermissions } from "@/lib/hooks/use-permissions";
import type { Category } from "@/lib/api/types";
import type { CategoryFormData } from "@/lib/validations/category-schema";
import PageHeader from "@/components/ui/page-header";
import DataTable from "@/components/ui/data-table";
import Pagination from "@/components/ui/pagination";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Modal from "@/components/ui/modal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import SearchInput from "@/components/ui/search-input";
import CategoryForm from "@/components/forms/category-form";

const columnHelper = createColumnHelper<Category>();

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data, isLoading } = useCategories({ page, search });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const { canDeleteProducts } = usePermissions();

  const columns = [
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("slug", { header: "Slug" }),
    columnHelper.accessor("parent_id", {
      header: "Parent",
      cell: (info) => {
        const parentId = info.getValue();
        if (!parentId) return "—";
        const parent = data?.categories.find((c) => c.id === parentId);
        return parent?.name ?? "—";
      },
    }),
    columnHelper.accessor("products_count", { header: "Products" }),
    columnHelper.accessor("active", {
      header: "Status",
      cell: (info) => (
        <Badge className={info.getValue() ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
          {info.getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
    }),
    columnHelper.accessor("position", { header: "Position" }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditCategory(info.row.original);
              setModalOpen(true);
            }}
            className="text-gray-500 hover:text-indigo-600"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          {canDeleteProducts && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(info.row.original);
              }}
              className="text-gray-500 hover:text-red-600"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    }),
  ];

  const handleSubmit = (formData: CategoryFormData) => {
    if (editCategory) {
      updateMutation.mutate(
        { id: editCategory.id, ...formData },
        {
          onSuccess: () => {
            toast.success("Category updated");
            closeModal();
          },
          onError: () => toast.error("Failed to update category"),
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Category created");
          closeModal();
        },
        onError: () => toast.error("Failed to create category"),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Category deleted");
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete category"),
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditCategory(undefined);
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
        title="Categories"
        actions={
          <Button onClick={() => { setEditCategory(undefined); setModalOpen(true); }}>
            <PlusIcon className="h-4 w-4 mr-2" /> Add Category
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search categories..." />
      </div>

      <DataTable data={data?.categories ?? []} columns={columns} />

      {data?.meta && (
        <Pagination currentPage={data.meta.current_page} totalPages={data.meta.total_pages} onPageChange={setPage} />
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editCategory ? "Edit Category" : "New Category"}>
        <CategoryForm
          category={editCategory}
          categories={data?.categories ?? []}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
