import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";

vi.mock("@/lib/api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from "@/lib/api/client";
import { useVariants, useCreateVariant, useUpdateVariant, useDeleteVariant } from "../use-variants";

const mockedGet = vi.mocked(apiClient.get);
const mockedPost = vi.mocked(apiClient.post);
const mockedPatch = vi.mocked(apiClient.patch);
const mockedDelete = vi.mocked(apiClient.delete);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  }
  return Wrapper;
}

describe("useVariants", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches variants for a product", async () => {
    mockedGet.mockResolvedValue({ data: { variants: [{ id: 1, name: "Large" }] } });

    const { result } = renderHook(() => useVariants(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(mockedGet).toHaveBeenCalledWith("/admin/products/1/variants");
  });
});

describe("useCreateVariant", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a variant", async () => {
    mockedPost.mockResolvedValue({ data: { id: 1, name: "Small" } });

    const { result } = renderHook(() => useCreateVariant(), { wrapper: createWrapper() });
    result.current.mutate({ productId: 1, name: "Small", price_cents: 999 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPost).toHaveBeenCalledWith("/admin/products/1/variants", {
      variant: { name: "Small", price_cents: 999 },
    });
  });
});

describe("useUpdateVariant", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates a variant", async () => {
    mockedPatch.mockResolvedValue({ data: { id: 1, name: "Medium" } });

    const { result } = renderHook(() => useUpdateVariant(), { wrapper: createWrapper() });
    result.current.mutate({ productId: 1, id: 1, name: "Medium" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPatch).toHaveBeenCalledWith("/admin/products/1/variants/1", {
      variant: { name: "Medium" },
    });
  });
});

describe("useDeleteVariant", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes a variant", async () => {
    mockedDelete.mockResolvedValue({});

    const { result } = renderHook(() => useDeleteVariant(), { wrapper: createWrapper() });
    result.current.mutate({ productId: 1, id: 2 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedDelete).toHaveBeenCalledWith("/admin/products/1/variants/2");
  });
});
