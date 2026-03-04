import type { Money } from "@/lib/api/types";

export function formatMoney(money: Money | null | undefined): string {
  if (!money) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(money.amount);
}

export function dollarsToCents(amount: number): number {
  return Math.round(amount * 100);
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}
