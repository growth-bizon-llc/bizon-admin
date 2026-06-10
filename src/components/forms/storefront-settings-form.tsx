"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  storefrontSettingsSchema,
  type StorefrontSettingsFormData,
} from "@/lib/validations/storefront-settings-schema";
import type { Store } from "@/lib/api/types";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Toggle from "@/components/ui/toggle";
import Button from "@/components/ui/button";
import ProductPicker from "@/components/ui/product-picker";

interface StorefrontSettingsFormProps {
  store: Store;
  onSubmit: (data: Partial<Store>) => void;
  loading?: boolean;
}

function isValidUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function StorefrontSettingsForm({
  store,
  onSubmit,
  loading,
}: StorefrontSettingsFormProps) {
  const settings = store.settings || {};

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm<StorefrontSettingsFormData>({
    resolver: zodResolver(storefrontSettingsSchema),
  });

  useEffect(() => {
    const homepage = settings.homepage as Record<string, unknown> | undefined;
    const contact = settings.contact as Record<string, unknown> | undefined;
    const hero = homepage?.hero as Record<string, unknown> | undefined;
    const heritage = homepage?.heritage as Record<string, unknown> | undefined;

    reset({
      contact_whatsapp: (contact?.whatsapp as string) || "",
      contact_email: (contact?.email as string) || "",
      contact_phone: (contact?.phone as string) || "",
      contact_instagram: (contact?.instagram as string) || "",
      contact_facebook: (contact?.facebook as string) || "",
      hero_image_url: (hero?.image_url as string) || "",
      hero_title: (hero?.title as string) || "",
      hero_subtitle: (hero?.subtitle as string) || "",
      heritage_image_url: (heritage?.image_url as string) || "",
      heritage_enabled: (heritage?.enabled as boolean) ?? true,
      bestsellers: (homepage?.bestsellers as string[]) || [],
      trending: (homepage?.trending as string[]) || [],
    });
  }, [store, reset]);

  const heroImageUrl = watch("hero_image_url");
  const heritageImageUrl = watch("heritage_image_url");

  const handleFormSubmit = (data: StorefrontSettingsFormData) => {
    const newSettings = {
      ...store.settings,
      contact: {
        whatsapp: data.contact_whatsapp || undefined,
        email: data.contact_email || undefined,
        phone: data.contact_phone || undefined,
        instagram: data.contact_instagram || undefined,
        facebook: data.contact_facebook || undefined,
      },
      homepage: {
        ...((store.settings?.homepage as Record<string, unknown>) || {}),
        hero: {
          image_url: data.hero_image_url || undefined,
          title: data.hero_title || undefined,
          subtitle: data.hero_subtitle || undefined,
        },
        heritage: {
          image_url: data.heritage_image_url || undefined,
          enabled: data.heritage_enabled,
        },
        bestsellers: data.bestsellers || [],
        trending: data.trending || [],
      },
    };
    onSubmit({ settings: newSettings });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl">
      {/* Section 1: Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Contact Information</h3>
          <p className="text-sm text-gray-500 mt-0.5">How customers can reach you</p>
        </div>
        <Input
          id="contact_whatsapp"
          label="WhatsApp"
          placeholder="+57 601 0123"
          {...register("contact_whatsapp")}
        />
        <Input
          id="contact_email"
          label="Email"
          placeholder="contacto@yourstore.com"
          {...register("contact_email")}
        />
        <Input
          id="contact_phone"
          label="Phone"
          {...register("contact_phone")}
        />
        <Input
          id="contact_instagram"
          label="Instagram"
          placeholder="@yourstore"
          {...register("contact_instagram")}
        />
        <Input
          id="contact_facebook"
          label="Facebook"
          placeholder="https://facebook.com/yourstore"
          {...register("contact_facebook")}
        />
      </div>

      {/* Section 2: Hero Banner */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Hero Banner</h3>
          <p className="text-sm text-gray-500 mt-0.5">The main banner on your homepage</p>
        </div>
        <div>
          <Input
            id="hero_image_url"
            label="Image URL"
            placeholder="https://example.com/hero.jpg"
            {...register("hero_image_url")}
          />
          {isValidUrl(heroImageUrl) && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageUrl}
                alt="Hero preview"
                className="h-20 w-auto rounded-md border border-gray-200 object-cover"
              />
            </div>
          )}
        </div>
        <Input
          id="hero_title"
          label="Title"
          {...register("hero_title")}
        />
        <Textarea
          id="hero_subtitle"
          label="Subtitle"
          rows={2}
          {...register("hero_subtitle")}
        />
      </div>

      {/* Section 3: Heritage Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Heritage Section</h3>
          <p className="text-sm text-gray-500 mt-0.5">Your brand story section</p>
        </div>
        <div>
          <Input
            id="heritage_image_url"
            label="Image URL"
            placeholder="https://example.com/heritage.jpg"
            {...register("heritage_image_url")}
          />
          {isValidUrl(heritageImageUrl) && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heritageImageUrl}
                alt="Heritage preview"
                className="h-20 w-auto rounded-md border border-gray-200 object-cover"
              />
            </div>
          )}
        </div>
        <Controller
          name="heritage_enabled"
          control={control}
          render={({ field }) => (
            <Toggle
              label="Enabled"
              enabled={field.value ?? true}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Section 4: Featured Products - Bestsellers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Featured Products — Bestsellers
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Products shown in the Bestsellers section. Max 8.
          </p>
        </div>
        <Controller
          name="bestsellers"
          control={control}
          render={({ field }) => (
            <ProductPicker
              selectedSlugs={field.value || []}
              onChange={field.onChange}
              maxItems={8}
            />
          )}
        />
      </div>

      {/* Section 5: Featured Products - Trending */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Featured Products — Trending
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Products shown in the Trending section. Max 8.
          </p>
        </div>
        <Controller
          name="trending"
          control={control}
          render={({ field }) => (
            <ProductPicker
              selectedSlugs={field.value || []}
              onChange={field.onChange}
              maxItems={8}
            />
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>
          Save Storefront Settings
        </Button>
      </div>
    </form>
  );
}
