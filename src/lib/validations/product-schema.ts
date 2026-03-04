import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  short_description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  base_price: z.number().min(0, "Price must be 0 or greater"),
  compare_at_price: z.preprocess(
    (val) => (typeof val === "number" && isNaN(val) ? "" : val),
    z.number().min(0).optional().or(z.literal(""))
  ),
  status: z.enum(["draft", "active", "archived"]),
  featured: z.boolean().optional(),
  category_id: z.union([z.number(), z.string(), z.null()]).optional(),
  track_inventory: z.boolean().optional(),
  quantity: z.number().int().min(0).optional(),
  custom_attributes: z.record(z.string(), z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
