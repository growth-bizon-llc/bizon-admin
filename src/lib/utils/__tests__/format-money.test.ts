import { describe, it, expect } from "vitest";
import { formatMoney, dollarsToCents, centsToDollars } from "../format-money";

describe("formatMoney", () => {
  it("formats a money object as currency", () => {
    expect(formatMoney({ amount: 25.0, currency: "USD" })).toBe("$25.00");
  });

  it("formats decimal amounts correctly", () => {
    expect(formatMoney({ amount: 9.99, currency: "USD" })).toBe("$9.99");
  });

  it("formats zero correctly", () => {
    expect(formatMoney({ amount: 0, currency: "USD" })).toBe("$0.00");
  });

  it("returns $0.00 for null", () => {
    expect(formatMoney(null)).toBe("$0.00");
  });

  it("returns $0.00 for undefined", () => {
    expect(formatMoney(undefined)).toBe("$0.00");
  });

  it("handles EUR currency", () => {
    const result = formatMoney({ amount: 10.5, currency: "EUR" });
    expect(result).toContain("10.50");
  });

  it("handles large amounts", () => {
    expect(formatMoney({ amount: 1234.56, currency: "USD" })).toBe("$1,234.56");
  });

  it("falls back to USD when currency is empty", () => {
    expect(formatMoney({ amount: 10.0, currency: "" })).toBe("$10.00");
  });
});

describe("dollarsToCents", () => {
  it("converts dollars to cents", () => {
    expect(dollarsToCents(25.0)).toBe(2500);
  });

  it("handles decimal precision", () => {
    expect(dollarsToCents(9.99)).toBe(999);
  });

  it("converts zero", () => {
    expect(dollarsToCents(0)).toBe(0);
  });

  it("rounds correctly for floating point", () => {
    expect(dollarsToCents(0.1 + 0.2)).toBe(30);
  });
});

describe("centsToDollars", () => {
  it("converts cents to dollars", () => {
    expect(centsToDollars(2500)).toBe(25.0);
  });

  it("handles odd cents", () => {
    expect(centsToDollars(999)).toBe(9.99);
  });

  it("converts zero", () => {
    expect(centsToDollars(0)).toBe(0);
  });
});
