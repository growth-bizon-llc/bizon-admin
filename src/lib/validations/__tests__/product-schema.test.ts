import { describe, it, expect } from "vitest";
import { productSchema } from "../product-schema";

describe("productSchema", () => {
  const validProduct = {
    name: "Test Product",
    base_price: 25.0,
    status: "draft" as const,
  };

  it("validates a minimal product", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = productSchema.safeParse({ ...validProduct, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = productSchema.safeParse({ ...validProduct, base_price: -5 });
    expect(result.success).toBe(false);
  });

  it("accepts zero price", () => {
    const result = productSchema.safeParse({ ...validProduct, base_price: 0 });
    expect(result.success).toBe(true);
  });

  it("validates all status values", () => {
    for (const status of ["draft", "active", "archived"] as const) {
      const result = productSchema.safeParse({ ...validProduct, status });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid status", () => {
    const result = productSchema.safeParse({ ...validProduct, status: "invalid" });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      description: "A product",
      sku: "SKU-001",
      featured: true,
      track_inventory: true,
      quantity: 10,
    });
    expect(result.success).toBe(true);
  });
});
