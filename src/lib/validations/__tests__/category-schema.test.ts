import { describe, it, expect } from "vitest";
import { categorySchema } from "../category-schema";

describe("categorySchema", () => {
  it("validates a minimal category", () => {
    const result = categorySchema.safeParse({ name: "Shoes" });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = categorySchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = categorySchema.safeParse({
      name: "Shoes",
      description: "All shoes",
      parent_id: 5,
      position: 1,
      active: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts null parent_id", () => {
    const result = categorySchema.safeParse({ name: "Top", parent_id: null });
    expect(result.success).toBe(true);
  });

  it("accepts string parent_id for form select", () => {
    const result = categorySchema.safeParse({ name: "Test", parent_id: "" });
    expect(result.success).toBe(true);
  });
});
