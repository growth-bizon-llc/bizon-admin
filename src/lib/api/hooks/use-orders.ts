"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type { Order, OrderList, OrderEvent, PaginationMeta } from "../types";

interface OrderFilters {
  page?: number;
  status?: string;
}

interface OrdersResponse {
  orders: OrderList[];
  meta: PaginationMeta;
}

export function useOrders(filters: OrderFilters = {}) {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.status) params.set("status", filters.status);
      const { data } = await apiClient.get(`/admin/orders?${params.toString()}`);
      return data;
    },
  });
}

export function useOrder(id: number | string) {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, event }: { id: number; event: OrderEvent }) => {
      const { data } = await apiClient.patch(`/admin/orders/${id}`, { event });
      return data as Order;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
