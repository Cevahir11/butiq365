import { z } from "zod";

export const CustomerSearchSchema = z.object({
  city: z.string().optional(),
  district: z.string().optional(),
  deliveryType: z.enum(["courier", "pickup", "any"]).default("any"),
  maxDeliveryTimeMinutes: z.number().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional()
});

export const SellerStockItemSchema = z.object({
  name: z.string(),
  category: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.number().int().positive()
});

export const SellerStockSchema = z.object({
  items: z.array(SellerStockItemSchema)
});

export type CustomerSearch = z.infer<typeof CustomerSearchSchema>;
export type SellerStock = z.infer<typeof SellerStockSchema>;