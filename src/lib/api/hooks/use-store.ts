"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type { Store } from "../types";

export function useStore() {
  return useQuery<Store>({
    queryKey: ["store"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/store");
      return data;
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Store>) => {
      const { data } = await apiClient.patch("/admin/store", { store: payload });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
}
