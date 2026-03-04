"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "../client";
import type { Customer, PaginationMeta } from "../types";

interface CustomerFilters {
  page?: number;
  search?: string;
}

interface CustomersResponse {
  customers: Customer[];
  meta: PaginationMeta;
}

export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery<CustomersResponse>({
    queryKey: ["customers", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.search) params.set("q", filters.search);
      const { data } = await apiClient.get(`/admin/customers?${params.toString()}`);
      return data;
    },
  });
}

export function useCustomer(id: number | string) {
  return useQuery<Customer>({
    queryKey: ["customer", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/admin/customers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
