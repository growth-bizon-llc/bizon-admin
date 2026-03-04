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
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../use-categories";

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

describe("useCategories", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches categories", async () => {
    mockedGet.mockResolvedValue({
      data: {
        categories: [{ id: 1, name: "Shoes" }],
        meta: { current_page: 1, per_page: 20, total_pages: 1, total_count: 1 },
      },
    });

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.categories).toHaveLength(1);
  });

  it("passes page filter", async () => {
    mockedGet.mockResolvedValue({
      data: { categories: [], meta: { current_page: 2, per_page: 20, total_pages: 3, total_count: 50 } },
    });

    renderHook(() => useCategories({ page: 2 }), { wrapper: createWrapper() });
    await waitFor(() => expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("page=2")));
  });

  it("passes search filter", async () => {
    mockedGet.mockResolvedValue({
      data: { categories: [], meta: { current_page: 1, per_page: 20, total_pages: 0, total_count: 0 } },
    });

    renderHook(() => useCategories({ search: "shoes" }), { wrapper: createWrapper() });
    await waitFor(() => expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("q=shoes")));
  });
});

describe("useCreateCategory", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a category", async () => {
    mockedPost.mockResolvedValue({ data: { id: 1, name: "New Cat" } });

    const { result } = renderHook(() => useCreateCategory(), { wrapper: createWrapper() });
    result.current.mutate({ name: "New Cat" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPost).toHaveBeenCalledWith("/admin/categories", { category: { name: "New Cat" } });
  });
});

describe("useUpdateCategory", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates a category", async () => {
    mockedPatch.mockResolvedValue({ data: { id: 1, name: "Updated" } });

    const { result } = renderHook(() => useUpdateCategory(), { wrapper: createWrapper() });
    result.current.mutate({ id: 1, name: "Updated" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPatch).toHaveBeenCalledWith("/admin/categories/1", { category: { name: "Updated" } });
  });
});

describe("useDeleteCategory", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes a category", async () => {
    mockedDelete.mockResolvedValue({});

    const { result } = renderHook(() => useDeleteCategory(), { wrapper: createWrapper() });
    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedDelete).toHaveBeenCalledWith("/admin/categories/1");
  });
});
