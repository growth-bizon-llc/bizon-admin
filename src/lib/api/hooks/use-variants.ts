"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type { Variant } from "../types";

export function useVariants(productId: number) {
  return useQuery<Variant[]>({
    queryKey: ["variants", productId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/products/${productId}/variants`);
      return data.variants;
    },
    enabled: !!productId,
  });
}

export function useCreateVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      ...payload
    }: Record<string, unknown> & { productId: number }) => {
      const { data } = await apiClient.post(`/admin/products/${productId}/variants`, {
        variant: payload,
      });
      return data as Variant;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["variants", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
    },
  });
}

export function useUpdateVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      id,
      ...payload
    }: Record<string, unknown> & { productId: number; id: number }) => {
      const { data } = await apiClient.patch(`/admin/products/${productId}/variants/${id}`, {
        variant: payload,
      });
      return data as Variant;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["variants", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
    },
  });
}

export function useDeleteVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, id }: { productId: number; id: number }) => {
      await apiClient.delete(`/admin/products/${productId}/variants/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["variants", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
    },
  });
}
