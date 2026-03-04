"use client";

import { useParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useCustomer } from "@/lib/api/hooks/use-customers";
import PageHeader from "@/components/ui/page-header";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { formatDateTime } from "@/lib/utils/format-date";

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: customer, isLoading, error } = useCustomer(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error || !customer) {
    return <p className="text-red-600">Customer not found.</p>;
  }

  return (
    <div>
      <PageHeader title={`${customer.first_name} ${customer.last_name}`} />

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">Email</span>
            <span className="font-medium text-gray-900">{customer.email}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Phone</span>
            <span className="font-medium text-gray-900">{customer.phone || "—"}</span>
          </div>
          <div>
            <span className="text-gray-500 block">First Name</span>
            <span className="font-medium text-gray-900">{customer.first_name}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Last Name</span>
            <span className="font-medium text-gray-900">{customer.last_name}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Orders</span>
            <span className="font-medium text-gray-900">{customer.orders_count}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Marketing Consent</span>
            <span className="text-gray-900">
              {customer.accepts_marketing ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 inline" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-gray-400 inline" />
              )}{" "}
              {customer.accepts_marketing ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Joined</span>
            <span className="font-medium text-gray-900">{formatDateTime(customer.created_at)}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Last Updated</span>
            <span className="font-medium text-gray-900">{formatDateTime(customer.updated_at)}</span>
          </div>
        </div>

        {customer.metadata && Object.keys(customer.metadata).length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Metadata</h3>
            <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto">
              {JSON.stringify(customer.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
