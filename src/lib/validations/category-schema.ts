import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  parent_id: z.union([z.number(), z.string(), z.null()]).optional(),
  position: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
