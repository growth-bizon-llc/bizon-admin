"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "../client";
import type { DashboardData } from "../types";

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/dashboard");
      return data;
    },
  });
}
