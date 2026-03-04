"use client";

import toast from "react-hot-toast";
import { useStore, useUpdateStore } from "@/lib/api/hooks/use-store";
import { usePermissions } from "@/lib/hooks/use-permissions";
import type { Store } from "@/lib/api/types";
import PageHeader from "@/components/ui/page-header";
import LoadingSpinner from "@/components/ui/loading-spinner";
import StoreForm from "@/components/forms/store-form";

export default function SettingsPage() {
  const { canManageStore } = usePermissions();
  const { data: store, isLoading } = useStore();
  const updateMutation = useUpdateStore();

  if (!canManageStore) {
    return (
      <div>
        <PageHeader title="Settings" />
        <p className="text-gray-500">You do not have permission to manage store settings.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (!store) {
    return <p className="text-red-600">Failed to load store settings.</p>;
  }

  const handleSubmit = (data: Partial<Store>) => {
    updateMutation.mutate(data, {
      onSuccess: () => toast.success("Settings saved"),
      onError: () => toast.error("Failed to save settings"),
    });
  };

  return (
    <div>
      <PageHeader title="Settings" />
      <StoreForm store={store} onSubmit={handleSubmit} loading={updateMutation.isPending} />
    </div>
  );
}
