import { describe, it, expect } from "vitest";
import { storeSchema } from "../store-schema";

describe("storeSchema", () => {
  const validStore = {
    name: "My Store",
    currency: "USD",
    locale: "en",
  };

  it("validates minimal store", () => {
    const result = storeSchema.safeParse(validStore);
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = storeSchema.safeParse({ ...validStore, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects empty currency", () => {
    const result = storeSchema.safeParse({ ...validStore, currency: "" });
    expect(result.success).toBe(false);
  });

  it("rejects empty locale", () => {
    const result = storeSchema.safeParse({ ...validStore, locale: "" });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields", () => {
    const result = storeSchema.safeParse({
      ...validStore,
      description: "A store",
      custom_domain: "store.example.com",
      subdomain: "mystore",
      active: true,
      settings: "{}",
    });
    expect(result.success).toBe(true);
  });
});
