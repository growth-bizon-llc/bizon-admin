"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type { ProductImage } from "../types";

export function useImages(productId: number) {
  return useQuery<ProductImage[]>({
    queryKey: ["images", productId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/products/${productId}/images`);
      return data.images;
    },
    enabled: !!productId,
  });
}

export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      file,
      altText,
      position,
    }: {
      productId: number;
      file: File;
      altText?: string;
      position?: number;
    }) => {
      const formData = new FormData();
      formData.append("image", file);
      if (altText) formData.append("alt_text", altText);
      if (position !== undefined) formData.append("position", String(position));

      const { data } = await apiClient.post(
        `/admin/products/${productId}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data as ProductImage;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["images", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
    },
  });
}

export function useUpdateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      id,
      ...payload
    }: {
      productId: number;
      id: number;
      alt_text?: string;
      position?: number;
    }) => {
      const { data } = await apiClient.patch(
        `/admin/products/${productId}/images/${id}`,
        payload
      );
      return data as ProductImage;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["images", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, id }: { productId: number; id: number }) => {
      await apiClient.delete(`/admin/products/${productId}/images/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["images", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
    },
  });
}
