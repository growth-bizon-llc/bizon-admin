"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData } from "@/lib/validations/category-schema";
import type { Category } from "@/lib/api/types";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import Toggle from "@/components/ui/toggle";
import Button from "@/components/ui/button";

interface CategoryFormProps {
  category?: Category;
  categories: Category[];
  onSubmit: (data: CategoryFormData) => void;
  loading?: boolean;
}

export default function CategoryForm({ category, categories, onSubmit, loading }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      parent_id: "",
      position: 0,
      active: true,
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || "",
        parent_id: category.parent_id ?? "",
        position: category.position,
        active: category.active,
      });
    }
  }, [category, reset]);

  const parentOptions = categories
    .filter((c) => !category || c.id !== category.id)
    .map((c) => ({ value: String(c.id), label: c.name }));

  const handleFormSubmit = (data: CategoryFormData) => {
    const payload = {
      ...data,
      parent_id: data.parent_id === "" ? null : data.parent_id,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        id="name"
        label="Name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Textarea
        id="description"
        label="Description"
        error={errors.description?.message}
        {...register("description")}
      />
      <Select
        id="parent_id"
        label="Parent Category"
        options={parentOptions}
        placeholder="None (top-level)"
        {...register("parent_id")}
      />
      <Input
        id="position"
        label="Position"
        type="number"
        error={errors.position?.message}
        {...register("position", { valueAsNumber: true })}
      />
      <Controller
        name="active"
        control={control}
        render={({ field }) => (
          <Toggle
            label="Active"
            enabled={field.value ?? true}
            onChange={field.onChange}
          />
        )}
      />
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" loading={loading}>
          {category ? "Update" : "Create"} Category
        </Button>
      </div>
    </form>
  );
}
