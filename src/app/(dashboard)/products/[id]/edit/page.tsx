"use client";

import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useProduct, useUpdateProduct } from "@/lib/api/hooks/use-products";
import { useCategories } from "@/lib/api/hooks/use-categories";
import PageHeader from "@/components/ui/page-header";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ProductForm from "@/components/forms/product-form";
import type { Product } from "@/lib/api/types";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: product, isLoading: productLoading } = useProduct(id);
  const { data: catData, isLoading: catLoading } = useCategories();
  const updateMutation = useUpdateProduct();

  const handleSubmit = async (payload: Record<string, unknown>): Promise<Product> => {
    const updated = await updateMutation.mutateAsync({ id: Number(id), ...payload });
    toast.success("Product updated");
    return updated;
  };

  if (productLoading || catLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-red-600">Product not found.</p>;
  }

  return (
    <div>
      <PageHeader title={`Edit: ${product.name}`} />
      <ProductForm
        product={product}
        categories={catData?.categories ?? []}
        onSubmit={handleSubmit}
        loading={updateMutation.isPending}
      />
    </div>
  );
}
