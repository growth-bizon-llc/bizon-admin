"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantSchema, type VariantFormData } from "@/lib/validations/variant-schema";
import type { Variant } from "@/lib/api/types";
import Input from "@/components/ui/input";
import Toggle from "@/components/ui/toggle";
import Button from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface VariantFormProps {
  variant?: Variant;
  onSubmit: (data: VariantFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function VariantForm({ variant, onSubmit, onCancel, loading }: VariantFormProps) {
  const [optionEntries, setOptionEntries] = useState<[string, string][]>(
    variant?.options ? Object.entries(variant.options) : [["", ""]]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: variant?.name ?? "",
      sku: variant?.sku ?? "",
      price: variant?.price?.amount ?? 0,
      compare_at_price: variant?.compare_at_price?.amount ?? "",
      track_inventory: variant?.track_inventory ?? false,
      quantity: variant?.quantity ?? 0,
      active: variant?.active ?? true,
    },
  });

  const addOption = () => setOptionEntries((prev) => [...prev, ["", ""]]);
  const removeOption = (idx: number) =>
    setOptionEntries((prev) => prev.filter((_, i) => i !== idx));
  const updateOption = (idx: number, key: string, value: string) => {
    setOptionEntries((prev) => prev.map((entry, i) => (i === idx ? [key, value] : entry)));
  };

  const handleFormSubmit = (data: VariantFormData) => {
    const options: Record<string, string> = {};
    optionEntries.forEach(([key, value]) => {
      if (key.trim()) options[key.trim()] = value;
    });
    onSubmit({ ...data, options });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <div className="grid grid-cols-2 gap-4">
        <Input id="variant-name" label="Name" error={errors.name?.message} {...register("name")} />
        <Input id="variant-sku" label="SKU" {...register("sku")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="variant-price" label="Price ($)" type="number" step="0.01" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
        <Input id="variant-compare" label="Compare at Price ($)" type="number" step="0.01" {...register("compare_at_price", { valueAsNumber: true })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="track_inventory"
          control={control}
          render={({ field }) => (
            <Toggle label="Track Inventory" enabled={field.value ?? false} onChange={field.onChange} />
          )}
        />
        <Input id="variant-qty" label="Quantity" type="number" {...register("quantity", { valueAsNumber: true })} />
      </div>
      <Controller
        name="active"
        control={control}
        render={({ field }) => (
          <Toggle label="Active" enabled={field.value ?? true} onChange={field.onChange} />
        )}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
        {optionEntries.map(([key, value], idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              placeholder="Key (e.g. Size)"
              value={key}
              onChange={(e) => updateOption(idx, e.target.value, value)}
              className="flex-1 rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
            />
            <input
              placeholder="Value (e.g. Large)"
              value={value}
              onChange={(e) => updateOption(idx, key, e.target.value)}
              className="flex-1 rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
            />
            <button type="button" onClick={() => removeOption(idx)} className="text-red-500 hover:text-red-700">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addOption} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
          <PlusIcon className="h-3 w-3" /> Add Option
        </button>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{variant ? "Update" : "Add"} Variant</Button>
      </div>
    </form>
  );
}
