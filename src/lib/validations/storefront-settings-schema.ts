import { z } from "zod";

export const storefrontSettingsSchema = z.object({
  contact_whatsapp: z.string().optional(),
  contact_email: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_instagram: z.string().optional(),
  contact_facebook: z.string().optional(),
  hero_image_url: z.string().optional(),
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  heritage_image_url: z.string().optional(),
  heritage_enabled: z.boolean().optional(),
  bestsellers: z.array(z.string()).optional(),
  trending: z.array(z.string()).optional(),
});

export type StorefrontSettingsFormData = z.infer<typeof storefrontSettingsSchema>;
