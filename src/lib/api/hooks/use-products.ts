"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type { Product, ProductList, PaginationMeta } from "../types";

interface ProductFilters {
  page?: number;
  search?: string;
  status?: string;
  category_id?: number;
}

interface ProductsResponse {
  products: ProductList[];
  meta: PaginationMeta;
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<ProductsResponse>({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.search) params.set("q", filters.search);
      if (filters.status) params.set("status", filters.status);
      if (filters.category_id) params.set("category_id", String(filters.category_id));
      const { data } = await apiClient.get(`/admin/products?${params.toString()}`);
      return data;
    },
  });
}

export function useProduct(id: number | string) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/products/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await apiClient.post("/admin/products", { product: payload });
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: number }) => {
      const { data } = await apiClient.patch(`/admin/products/${id}`, { product: payload });
      return data as Product;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
