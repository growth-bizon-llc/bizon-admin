"use client";

import {
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import StatCard from "@/components/ui/stat-card";
import type { DashboardData } from "@/lib/api/types";
import { centsToDollars } from "@/lib/utils/format-money";

interface StatsGridProps {
  data: DashboardData;
}

export default function StatsGrid({ data }: StatsGridProps) {
  const revenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(centsToDollars(data.total_revenue_cents));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Products"
        value={data.total_products}
        icon={<CubeIcon className="h-6 w-6" />}
      />
      <StatCard
        label="Orders"
        value={data.total_orders}
        icon={<ShoppingCartIcon className="h-6 w-6" />}
      />
      <StatCard
        label="Customers"
        value={data.total_customers}
        icon={<UsersIcon className="h-6 w-6" />}
      />
      <StatCard
        label="Revenue"
        value={revenue}
        icon={<CurrencyDollarIcon className="h-6 w-6" />}
      />
    </div>
  );
}
