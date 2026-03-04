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
import {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../use-products";

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

describe("useProducts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches products list", async () => {
    const response = {
      products: [{ id: 1, name: "Test" }],
      meta: { current_page: 1, per_page: 20, total_pages: 1, total_count: 1 },
    };
    mockedGet.mockResolvedValue({ data: response });

    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.products).toHaveLength(1);
    expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("/admin/products"));
  });

  it("passes search filter", async () => {
    mockedGet.mockResolvedValue({ data: { products: [], meta: { current_page: 1, per_page: 20, total_pages: 0, total_count: 0 } } });

    renderHook(() => useProducts({ search: "widget" }), { wrapper: createWrapper() });

    await waitFor(() => expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("q=widget")));
  });

  it("passes status filter", async () => {
    mockedGet.mockResolvedValue({ data: { products: [], meta: { current_page: 1, per_page: 20, total_pages: 0, total_count: 0 } } });

    renderHook(() => useProducts({ status: "active" }), { wrapper: createWrapper() });

    await waitFor(() => expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("status=active")));
  });
});

describe("useProduct", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches a single product", async () => {
    mockedGet.mockResolvedValue({ data: { id: 1, name: "Widget" } });

    const { result } = renderHook(() => useProduct(1), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe("Widget");
    expect(mockedGet).toHaveBeenCalledWith("/admin/products/1");
  });
});

describe("useCreateProduct", () => {
  beforeEach(() => vi.clearAllMocks());

  it("posts product data", async () => {
    mockedPost.mockResolvedValue({ data: { id: 1, name: "New" } });

    const { result } = renderHook(() => useCreateProduct(), { wrapper: createWrapper() });
    result.current.mutate({ name: "New", base_price_cents: 1000 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPost).toHaveBeenCalledWith("/admin/products", { product: { name: "New", base_price_cents: 1000 } });
  });
});

describe("useUpdateProduct", () => {
  beforeEach(() => vi.clearAllMocks());

  it("patches product data", async () => {
    mockedPatch.mockResolvedValue({ data: { id: 1, name: "Updated" } });

    const { result } = renderHook(() => useUpdateProduct(), { wrapper: createWrapper() });
    result.current.mutate({ id: 1, name: "Updated" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPatch).toHaveBeenCalledWith("/admin/products/1", { product: { name: "Updated" } });
  });
});

describe("useDeleteProduct", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes a product", async () => {
    mockedDelete.mockResolvedValue({});

    const { result } = renderHook(() => useDeleteProduct(), { wrapper: createWrapper() });
    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedDelete).toHaveBeenCalledWith("/admin/products/1");
  });
});
