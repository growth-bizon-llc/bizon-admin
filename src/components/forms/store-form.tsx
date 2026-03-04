"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSchema, type StoreFormData } from "@/lib/validations/store-schema";
import { CURRENCY_OPTIONS, LOCALE_OPTIONS } from "@/lib/utils/constants";
import type { Store } from "@/lib/api/types";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Select from "@/components/ui/select";
import Toggle from "@/components/ui/toggle";
import Button from "@/components/ui/button";

interface StoreFormProps {
  store: Store;
  onSubmit: (data: Partial<Store>) => void;
  loading?: boolean;
}

export default function StoreForm({ store, onSubmit, loading }: StoreFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
  });

  useEffect(() => {
    reset({
      name: store.name,
      description: store.description || "",
      custom_domain: store.custom_domain || "",
      subdomain: store.subdomain || "",
      currency: store.currency,
      locale: store.locale,
      active: store.active,
      tax_rate: store.tax_rate ?? 0,
      settings: JSON.stringify(store.settings || {}, null, 2),
    });
  }, [store, reset]);

  const handleFormSubmit = (data: StoreFormData) => {
    let settings: Record<string, unknown> = {};
    try {
      settings = data.settings ? JSON.parse(data.settings) : {};
    } catch {
      // keep empty
    }

    onSubmit({
      name: data.name,
      description: data.description,
      custom_domain: data.custom_domain || null,
      subdomain: data.subdomain || null,
      currency: data.currency,
      locale: data.locale,
      active: data.active,
      tax_rate: data.tax_rate,
      settings,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Input id="name" label="Store Name" error={errors.name?.message} {...register("name")} />
        <Textarea id="description" label="Description" {...register("description")} />
        <div className="grid grid-cols-2 gap-4">
          <Input id="custom_domain" label="Custom Domain" {...register("custom_domain")} />
          <Input id="subdomain" label="Subdomain" {...register("subdomain")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            id="currency"
            label="Currency"
            options={CURRENCY_OPTIONS}
            error={errors.currency?.message}
            {...register("currency")}
          />
          <Select
            id="locale"
            label="Locale"
            options={LOCALE_OPTIONS}
            error={errors.locale?.message}
            {...register("locale")}
          />
        </div>
        <Input
          id="tax_rate"
          label="Tax Rate (%)"
          type="number"
          step="0.01"
          error={errors.tax_rate?.message}
          {...register("tax_rate", { valueAsNumber: true })}
        />
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <Toggle label="Active" enabled={field.value ?? true} onChange={field.onChange} />
          )}
        />
        <Textarea
          id="settings"
          label="Settings (JSON)"
          {...register("settings")}
          rows={6}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Save Settings
        </Button>
      </div>
    </form>
  );
}
