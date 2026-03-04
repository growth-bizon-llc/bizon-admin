import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().optional(),
  custom_domain: z.string().optional(),
  subdomain: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  locale: z.string().min(1, "Locale is required"),
  active: z.boolean().optional(),
  tax_rate: z.number().min(0).max(100).optional(),
  settings: z.string().optional(),
});

export type StoreFormData = z.infer<typeof storeSchema>;
