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
import { useImages, useUploadImage, useUpdateImage, useDeleteImage } from "../use-images";

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

describe("useImages", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches images for a product", async () => {
    mockedGet.mockResolvedValue({ data: { images: [{ id: 1, url: "/img.jpg" }] } });

    const { result } = renderHook(() => useImages(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(mockedGet).toHaveBeenCalledWith("/admin/products/1/images");
  });
});

describe("useUploadImage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uploads a file via FormData", async () => {
    mockedPost.mockResolvedValue({ data: { id: 1, url: "/uploaded.jpg" } });

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const { result } = renderHook(() => useUploadImage(), { wrapper: createWrapper() });
    result.current.mutate({ productId: 1, file });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPost).toHaveBeenCalledWith(
      "/admin/products/1/images",
      expect.any(FormData),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  });

  it("includes altText and position in FormData when provided", async () => {
    mockedPost.mockResolvedValue({ data: { id: 1, url: "/uploaded.jpg" } });

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const { result } = renderHook(() => useUploadImage(), { wrapper: createWrapper() });
    result.current.mutate({ productId: 1, file, altText: "Product photo", position: 2 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const formData = mockedPost.mock.calls[0][1] as FormData;
    expect(formData.get("alt_text")).toBe("Product photo");
    expect(formData.get("position")).toBe("2");
  });
});

describe("useUpdateImage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates image metadata", async () => {
    mockedPatch.mockResolvedValue({ data: { id: 1, alt_text: "Updated" } });

    const { result } = renderHook(() => useUpdateImage(), { wrapper: createWrapper() });
    result.current.mutate({ productId: 1, id: 1, alt_text: "Updated" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPatch).toHaveBeenCalledWith("/admin/products/1/images/1", {
      alt_text: "Updated",
    });
  });
});

describe("useDeleteImage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes an image", async () => {
    mockedDelete.mockResolvedValue({});

    const { result } = renderHook(() => useDeleteImage(), { wrapper: createWrapper() });
    result.current.mutate({ productId: 1, id: 1 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedDelete).toHaveBeenCalledWith("/admin/products/1/images/1");
  });
});
