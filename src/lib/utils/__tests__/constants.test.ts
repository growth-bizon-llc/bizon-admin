import { describe, it, expect } from "vitest";
import {
  ORDER_STATUS_COLORS,
  PRODUCT_STATUS_COLORS,
  ORDER_STATUS_TRANSITIONS,
  CURRENCY_OPTIONS,
  LOCALE_OPTIONS,
} from "../constants";

describe("PRODUCT_STATUS_COLORS", () => {
  it("has colors for all product statuses", () => {
    expect(PRODUCT_STATUS_COLORS.draft).toBeDefined();
    expect(PRODUCT_STATUS_COLORS.active).toBeDefined();
    expect(PRODUCT_STATUS_COLORS.archived).toBeDefined();
  });
});

describe("ORDER_STATUS_COLORS", () => {
  it("has colors for all order statuses", () => {
    const statuses = ["pending", "confirmed", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;
    statuses.forEach((s) => expect(ORDER_STATUS_COLORS[s]).toBeDefined());
  });
});

describe("ORDER_STATUS_TRANSITIONS", () => {
  it("pending can confirm or cancel", () => {
    const events = ORDER_STATUS_TRANSITIONS.pending.map((t) => t.event);
    expect(events).toContain("confirm");
    expect(events).toContain("cancel");
  });

  it("confirmed can pay or cancel", () => {
    const events = ORDER_STATUS_TRANSITIONS.confirmed.map((t) => t.event);
    expect(events).toContain("pay");
    expect(events).toContain("cancel");
  });

  it("paid can process or refund", () => {
    const events = ORDER_STATUS_TRANSITIONS.paid.map((t) => t.event);
    expect(events).toContain("process_order");
    expect(events).toContain("refund");
  });

  it("processing can ship", () => {
    const events = ORDER_STATUS_TRANSITIONS.processing.map((t) => t.event);
    expect(events).toContain("ship");
  });

  it("shipped can deliver", () => {
    const events = ORDER_STATUS_TRANSITIONS.shipped.map((t) => t.event);
    expect(events).toContain("deliver");
  });

  it("delivered has no transitions", () => {
    expect(ORDER_STATUS_TRANSITIONS.delivered).toHaveLength(0);
  });

  it("cancelled has no transitions", () => {
    expect(ORDER_STATUS_TRANSITIONS.cancelled).toHaveLength(0);
  });

  it("refunded has no transitions", () => {
    expect(ORDER_STATUS_TRANSITIONS.refunded).toHaveLength(0);
  });
});

describe("CURRENCY_OPTIONS", () => {
  it("has options", () => {
    expect(CURRENCY_OPTIONS.length).toBeGreaterThan(0);
    expect(CURRENCY_OPTIONS[0]).toHaveProperty("value");
    expect(CURRENCY_OPTIONS[0]).toHaveProperty("label");
  });

  it("includes USD", () => {
    expect(CURRENCY_OPTIONS.find((o) => o.value === "USD")).toBeDefined();
  });
});

describe("LOCALE_OPTIONS", () => {
  it("has options", () => {
    expect(LOCALE_OPTIONS.length).toBeGreaterThan(0);
  });

  it("includes English", () => {
    expect(LOCALE_OPTIONS.find((o) => o.value === "en")).toBeDefined();
  });
});
