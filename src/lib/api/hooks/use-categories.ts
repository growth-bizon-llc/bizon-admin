"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";
import type { Category, PaginationMeta } from "../types";

interface CategoryFilters {
  page?: number;
  search?: string;
}

interface CategoriesResponse {
  categories: Category[];
  meta: PaginationMeta;
}

export function useCategories(filters: CategoryFilters = {}) {
  return useQuery<CategoriesResponse>({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.search) params.set("q", filters.search);
      const { data } = await apiClient.get(`/admin/categories?${params.toString()}`);
      return data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await apiClient.post("/admin/categories", { category: payload });
      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: number }) => {
      const { data } = await apiClient.patch(`/admin/categories/${id}`, { category: payload });
      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
