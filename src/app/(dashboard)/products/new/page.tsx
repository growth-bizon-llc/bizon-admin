"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCreateProduct } from "@/lib/api/hooks/use-products";
import { useCategories } from "@/lib/api/hooks/use-categories";
import PageHeader from "@/components/ui/page-header";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ProductForm from "@/components/forms/product-form";
import type { Product } from "@/lib/api/types";

export default function NewProductPage() {
  const router = useRouter();
  const createMutation = useCreateProduct();
  const { data: catData, isLoading: catLoading } = useCategories();

  const handleSubmit = async (payload: Record<string, unknown>): Promise<Product> => {
    const product = await createMutation.mutateAsync(payload);
    toast.success("Product created");
    router.push(`/products/${product.id}/edit`);
    return product;
  };

  if (catLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="New Product" />
      <ProductForm
        categories={catData?.categories ?? []}
        onSubmit={handleSubmit}
        loading={createMutation.isPending}
      />
    </div>
  );
}
