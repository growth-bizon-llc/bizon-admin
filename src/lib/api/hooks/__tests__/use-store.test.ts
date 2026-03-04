import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";

vi.mock("@/lib/api/client", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

import apiClient from "@/lib/api/client";
import { useStore, useUpdateStore } from "../use-store";

const mockedGet = vi.mocked(apiClient.get);
const mockedPatch = vi.mocked(apiClient.patch);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  }
  return Wrapper;
}

describe("useStore", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches store data", async () => {
    mockedGet.mockResolvedValue({ data: { id: 1, name: "My Store", currency: "USD" } });

    const { result } = renderHook(() => useStore(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe("My Store");
    expect(mockedGet).toHaveBeenCalledWith("/admin/store");
  });
});

describe("useUpdateStore", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates store settings", async () => {
    mockedPatch.mockResolvedValue({ data: { id: 1, name: "Updated Store" } });

    const { result } = renderHook(() => useUpdateStore(), { wrapper: createWrapper() });
    result.current.mutate({ name: "Updated Store" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPatch).toHaveBeenCalledWith("/admin/store", { store: { name: "Updated Store" } });
  });
});
