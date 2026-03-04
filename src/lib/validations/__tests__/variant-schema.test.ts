import { describe, it, expect } from "vitest";
import { variantSchema } from "../variant-schema";

describe("variantSchema", () => {
  const validVariant = {
    name: "Large",
    price: 29.99,
  };

  it("validates minimal variant", () => {
    const result = variantSchema.safeParse(validVariant);
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = variantSchema.safeParse({ ...validVariant, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = variantSchema.safeParse({ ...validVariant, price: -1 });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = variantSchema.safeParse({
      ...validVariant,
      sku: "LG-001",
      track_inventory: true,
      quantity: 50,
      options: { size: "Large", color: "Blue" },
      active: true,
    });
    expect(result.success).toBe(true);
  });
});
