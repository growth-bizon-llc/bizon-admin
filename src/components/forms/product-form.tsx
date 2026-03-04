"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { productSchema, type ProductFormData } from "@/lib/validations/product-schema";
import type { Product, Category, Variant } from "@/lib/api/types";
import { useCreateVariant, useUpdateVariant, useDeleteVariant } from "@/lib/api/hooks/use-variants";
import { useUploadImage, useDeleteImage } from "@/lib/api/hooks/use-images";
import { dollarsToCents } from "@/lib/utils/format-money";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import Toggle from "@/components/ui/toggle";
import Button from "@/components/ui/button";
import ImageUpload from "@/components/ui/image-upload";
import VariantForm from "./variant-form";
import type { VariantFormData } from "@/lib/validations/variant-schema";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: Record<string, unknown>) => Promise<Product>;
  loading?: boolean;
}

export default function ProductForm({ product, categories, onSubmit, loading }: ProductFormProps) {
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | undefined>();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [attrEntries, setAttrEntries] = useState<[string, string][]>(
    product?.custom_attributes ? Object.entries(product.custom_attributes) : []
  );

  const createVariant = useCreateVariant();
  const updateVariant = useUpdateVariant();
  const deleteVariant = useDeleteVariant();
  const uploadImage = useUploadImage();
  const deleteImage = useDeleteImage();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      short_description: "",
      sku: "",
      barcode: "",
      base_price: 0,
      compare_at_price: "",
      status: "draft",
      featured: false,
      category_id: "",
      track_inventory: false,
      quantity: 0,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        short_description: product.short_description || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        base_price: product.base_price?.amount ?? 0,
        compare_at_price: product.compare_at_price?.amount ?? "",
        status: product.status,
        featured: product.featured,
        category_id: product.category?.id ?? "",
        track_inventory: product.track_inventory,
        quantity: product.quantity,
      });
      setAttrEntries(product.custom_attributes ? Object.entries(product.custom_attributes) : []);
    }
  }, [product, reset]);

  const trackInventory = watch("track_inventory");

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

  const handleFormSubmit = async (data: ProductFormData) => {
    const customAttributes: Record<string, string> = {};
    attrEntries.forEach(([key, value]) => {
      if (key.trim()) customAttributes[key.trim()] = value;
    });

    const payload: Record<string, unknown> = {
      name: data.name,
      description: data.description,
      short_description: data.short_description,
      sku: data.sku,
      barcode: data.barcode,
      base_price_cents: dollarsToCents(data.base_price),
      status: data.status,
      featured: data.featured,
      track_inventory: data.track_inventory,
      quantity: data.quantity,
      custom_attributes: customAttributes,
    };

    if (data.compare_at_price !== "" && data.compare_at_price !== undefined) {
      payload.compare_at_price_cents = dollarsToCents(Number(data.compare_at_price));
    }

    if (data.category_id && data.category_id !== "") {
      payload.category_id = data.category_id;
    } else {
      payload.category_id = null;
    }

    try {
      const savedProduct = await onSubmit(payload);

      // Upload pending images
      for (const file of pendingFiles) {
        await uploadImage.mutateAsync({ productId: savedProduct.id, file });
      }
      setPendingFiles([]);
    } catch {
      // Error handled by parent
    }
  };

  const handleVariantSubmit = (data: VariantFormData) => {
    if (!product) return;

    const payload: Record<string, unknown> = {
      productId: product.id,
      name: data.name,
      sku: data.sku,
      price_cents: dollarsToCents(data.price),
      track_inventory: data.track_inventory,
      quantity: data.quantity,
      options: data.options,
      active: data.active,
    };

    if (data.compare_at_price !== "" && data.compare_at_price !== undefined) {
      payload.compare_at_price_cents = dollarsToCents(Number(data.compare_at_price));
    }

    if (editingVariant) {
      updateVariant.mutate(
        { ...payload, id: editingVariant.id } as Record<string, unknown> & { productId: number; id: number },
        {
          onSuccess: () => {
            toast.success("Variant updated");
            setShowVariantForm(false);
            setEditingVariant(undefined);
          },
          onError: () => toast.error("Failed to update variant"),
        }
      );
    } else {
      createVariant.mutate(payload as Record<string, unknown> & { productId: number }, {
        onSuccess: () => {
          toast.success("Variant created");
          setShowVariantForm(false);
        },
        onError: () => toast.error("Failed to create variant"),
      });
    }
  };

  const handleDeleteVariant = (variantId: number) => {
    if (!product) return;
    deleteVariant.mutate(
      { productId: product.id, id: variantId },
      {
        onSuccess: () => toast.success("Variant deleted"),
        onError: () => toast.error("Failed to delete variant"),
      }
    );
  };

  const handleDeleteImage = (imageId: number) => {
    if (!product) return;
    deleteImage.mutate(
      { productId: product.id, id: imageId },
      {
        onSuccess: () => toast.success("Image deleted"),
        onError: () => toast.error("Failed to delete image"),
      }
    );
  };

  const addAttr = () => setAttrEntries((prev) => [...prev, ["", ""]]);
  const removeAttr = (idx: number) => setAttrEntries((prev) => prev.filter((_, i) => i !== idx));
  const updateAttr = (idx: number, key: string, value: string) => {
    setAttrEntries((prev) => prev.map((entry, i) => (i === idx ? [key, value] : entry)));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* General Info */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">General Information</h2>
        <div className="space-y-4">
          <Input id="name" label="Name" error={errors.name?.message} {...register("name")} />
          <Textarea id="description" label="Description" {...register("description")} />
          <Textarea id="short_description" label="Short Description" {...register("short_description")} />
          <div className="grid grid-cols-2 gap-4">
            <Input id="sku" label="SKU" {...register("sku")} />
            <Input id="barcode" label="Barcode" {...register("barcode")} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input id="base_price" label="Price ($)" type="number" step="0.01" error={errors.base_price?.message} {...register("base_price", { valueAsNumber: true })} />
          <Input id="compare_at_price" label="Compare at Price ($)" type="number" step="0.01" {...register("compare_at_price", { valueAsNumber: true })} />
        </div>
      </section>

      {/* Organization */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
        <div className="space-y-4">
          <Select id="category_id" label="Category" options={categoryOptions} placeholder="Select category" {...register("category_id")} />
          <Select
            id="status"
            label="Status"
            options={[
              { value: "draft", label: "Draft" },
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
            ]}
            {...register("status")}
          />
          <Controller
            name="featured"
            control={control}
            render={({ field }) => <Toggle label="Featured" enabled={field.value ?? false} onChange={field.onChange} />}
          />
        </div>
      </section>

      {/* Inventory */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
        <div className="space-y-4">
          <Controller
            name="track_inventory"
            control={control}
            render={({ field }) => <Toggle label="Track Inventory" enabled={field.value ?? false} onChange={field.onChange} />}
          />
          {trackInventory && (
            <Input id="quantity" label="Quantity" type="number" {...register("quantity", { valueAsNumber: true })} />
          )}
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
        {product?.images && product.images.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-4">
            {product.images.map((img) => (
              <div key={img.id} className="relative group">
                {img.url && (
                  <img src={img.url} alt={img.alt_text} className="h-24 w-24 object-cover rounded-lg" />
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <ImageUpload onFilesSelected={(files) => setPendingFiles((prev) => [...prev, ...files])} />
      </section>

      {/* Variants - only on edit */}
      {product && (
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Variants</h2>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setEditingVariant(undefined);
                setShowVariantForm(true);
              }}
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add Variant
            </Button>
          </div>
          {product.variants?.map((v) => (
            <div key={v.id} className="flex items-center justify-between border-b py-3">
              <div>
                <span className="font-medium text-gray-900">{v.name}</span>
                <span className="ml-2 text-sm text-gray-600">${v.price.amount.toFixed(2)}</span>
                {v.sku && <span className="ml-2 text-xs text-gray-400">SKU: {v.sku}</span>}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingVariant(v);
                    setShowVariantForm(true);
                  }}
                  className="text-gray-500 hover:text-indigo-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteVariant(v.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {showVariantForm && (
            <div className="mt-4">
              <VariantForm
                variant={editingVariant}
                onSubmit={handleVariantSubmit}
                onCancel={() => {
                  setShowVariantForm(false);
                  setEditingVariant(undefined);
                }}
                loading={createVariant.isPending || updateVariant.isPending}
              />
            </div>
          )}
        </section>
      )}

      {/* Custom Attributes */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Attributes</h2>
        {attrEntries.map(([key, value], idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              placeholder="Key"
              value={key}
              onChange={(e) => updateAttr(idx, e.target.value, value)}
              className="flex-1 rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
            />
            <input
              placeholder="Value"
              value={value}
              onChange={(e) => updateAttr(idx, key, e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
            />
            <button type="button" onClick={() => removeAttr(idx)} className="text-red-500">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addAttr} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
          <PlusIcon className="h-3 w-3" /> Add Attribute
        </button>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={loading}>
          {product ? "Update" : "Create"} Product
        </Button>
      </div>
    </form>
  );
}
