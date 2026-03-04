"use client";

import { formatMoney } from "@/lib/utils/format-money";
import type { Money } from "@/lib/api/types";

interface MoneyDisplayProps {
  money: Money | null | undefined;
  className?: string;
}

export default function MoneyDisplay({ money, className }: MoneyDisplayProps) {
  return <span className={className}>{formatMoney(money)}</span>;
}
