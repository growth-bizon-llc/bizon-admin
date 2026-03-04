"use client";

import Badge from "./badge";
import { ORDER_STATUS_COLORS } from "@/lib/utils/constants";
import type { OrderStatus } from "@/lib/api/types";

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={ORDER_STATUS_COLORS[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
