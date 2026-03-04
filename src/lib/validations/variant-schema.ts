import { z } from "zod";

export const variantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  compare_at_price: z.number().min(0).optional().or(z.literal("")),
  track_inventory: z.boolean().optional(),
  quantity: z.number().int().min(0).optional(),
  options: z.record(z.string(), z.string()).optional(),
  active: z.boolean().optional(),
});

export type VariantFormData = z.infer<typeof variantSchema>;
