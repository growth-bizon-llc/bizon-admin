"use client";

import { useDashboard } from "@/lib/api/hooks/use-dashboard";
import PageHeader from "@/components/ui/page-header";
import LoadingSpinner from "@/components/ui/loading-spinner";
import StatsGrid from "@/components/dashboard/stats-grid";
import OrdersByStatusChart from "@/components/dashboard/orders-by-status-chart";
import RecentOrdersTable from "@/components/dashboard/recent-orders-table";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-red-600">Failed to load dashboard data.</p>;
  }

  return (
    <div>
      <PageHeader title="Dashboard" />
      <StatsGrid data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersByStatusChart data={data.orders_by_status} />
        <RecentOrdersTable orders={data.recent_orders} />
      </div>
    </div>
  );
}
