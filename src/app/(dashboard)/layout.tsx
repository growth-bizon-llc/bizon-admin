"use client";

import AuthGuard from "@/components/layout/auth-guard";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
