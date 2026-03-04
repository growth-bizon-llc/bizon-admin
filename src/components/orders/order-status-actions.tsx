"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useUpdateOrderStatus } from "@/lib/api/hooks/use-orders";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { ORDER_STATUS_TRANSITIONS } from "@/lib/utils/constants";
import type { Order, OrderEvent } from "@/lib/api/types";
import Button from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";

interface OrderStatusActionsProps {
  order: Order;
}

export default function OrderStatusActions({ order }: OrderStatusActionsProps) {
  const { canUpdateOrderStatus } = usePermissions();
  const updateStatus = useUpdateOrderStatus();
  const [confirmAction, setConfirmAction] = useState<{ event: OrderEvent; label: string; successMessage: string } | null>(null);

  if (!canUpdateOrderStatus) return null;

  const transitions = ORDER_STATUS_TRANSITIONS[order.status] ?? [];

  if (transitions.length === 0) return null;

  const handleConfirm = () => {
    if (!confirmAction) return;
    updateStatus.mutate(
      { id: order.id, event: confirmAction.event },
      {
        onSuccess: () => {
          toast.success(confirmAction.successMessage);
          setConfirmAction(null);
        },
        onError: () => toast.error("Failed to update order status"),
      }
    );
  };

  return (
    <div className="flex gap-2">
      {transitions.map((t) => (
        <Button
          key={t.event}
          variant={t.event === "cancel" || t.event === "refund" ? "danger" : "primary"}
          size="sm"
          onClick={() => setConfirmAction(t)}
        >
          {t.label}
        </Button>
      ))}

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={`${confirmAction?.label} Order`}
        message={`Are you sure you want to ${confirmAction?.label.toLowerCase()} this order?`}
        confirmLabel={confirmAction?.label ?? "Confirm"}
        loading={updateStatus.isPending}
      />
    </div>
  );
}
