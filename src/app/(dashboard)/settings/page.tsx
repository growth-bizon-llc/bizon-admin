"use client";

import toast from "react-hot-toast";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useStore, useUpdateStore } from "@/lib/api/hooks/use-store";
import { usePermissions } from "@/lib/hooks/use-permissions";
import type { Store } from "@/lib/api/types";
import PageHeader from "@/components/ui/page-header";
import LoadingSpinner from "@/components/ui/loading-spinner";
import StoreForm from "@/components/forms/store-form";
import StorefrontSettingsForm from "@/components/forms/storefront-settings-form";

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
      <TabGroup>
        <TabList className="flex border-b border-gray-200 mb-6">
          <Tab className="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none data-[selected]:border-indigo-600 data-[selected]:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
            General
          </Tab>
          <Tab className="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none data-[selected]:border-indigo-600 data-[selected]:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Storefront
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <StoreForm store={store} onSubmit={handleSubmit} loading={updateMutation.isPending} />
          </TabPanel>
          <TabPanel>
            <StorefrontSettingsForm
              store={store}
              onSubmit={handleSubmit}
              loading={updateMutation.isPending}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
