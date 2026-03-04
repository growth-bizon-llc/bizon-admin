import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime, formatRelative } from "../format-date";

describe("formatDate", () => {
  it("formats a date string", () => {
    expect(formatDate("2024-06-15T10:30:00Z")).toBe("Jun 15, 2024");
  });

  it("returns dash for null", () => {
    expect(formatDate(null)).toBe("—");
  });

  it("returns dash for undefined", () => {
    expect(formatDate(undefined)).toBe("—");
  });
});

describe("formatDateTime", () => {
  it("formats date with time", () => {
    const result = formatDateTime("2024-06-15T10:30:00Z");
    expect(result).toContain("Jun 15, 2024");
    expect(result).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/);
  });

  it("returns dash for null", () => {
    expect(formatDateTime(null)).toBe("—");
  });
});

describe("formatRelative", () => {
  it("returns a relative time string", () => {
    const result = formatRelative(new Date().toISOString());
    expect(result).toContain("ago");
  });

  it("returns dash for null", () => {
    expect(formatRelative(null)).toBe("—");
  });

  it("returns dash for undefined", () => {
    expect(formatRelative(undefined)).toBe("—");
  });
});
