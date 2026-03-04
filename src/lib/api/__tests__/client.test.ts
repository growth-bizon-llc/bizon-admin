import { describe, it, expect, beforeEach } from "vitest";
import apiClient from "../client";
import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

describe("apiClient", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("has the correct base URL", () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
  });

  it("sets Content-Type to application/json", () => {
    expect(apiClient.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("attaches Authorization header when token exists", async () => {
    localStorage.setItem("auth_token", "test-token");

    // Simulate request interceptor by creating a config and running it through the interceptor
    const config: InternalAxiosRequestConfig = {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig;

    // Access the interceptor handlers directly
    const handlers = (apiClient.interceptors.request as unknown as { handlers: Array<{ fulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig }> }).handlers;
    const result = handlers[0].fulfilled(config);
    expect(result.headers.Authorization).toBe("Bearer test-token");
  });

  it("does not attach Authorization header when no token", async () => {
    const config: InternalAxiosRequestConfig = {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig;

    const handlers = (apiClient.interceptors.request as unknown as { handlers: Array<{ fulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig }> }).handlers;
    const result = handlers[0].fulfilled(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it("clears storage and redirects on 401 response", async () => {
    localStorage.setItem("auth_token", "test-token");
    localStorage.setItem("auth_user", "{}");

    Object.defineProperty(window, "location", {
      value: { href: "/dashboard", pathname: "/dashboard" },
      writable: true,
      configurable: true,
    });

    const handlers = (apiClient.interceptors.response as unknown as { handlers: Array<{ rejected: (error: unknown) => Promise<unknown> }> }).handlers;
    await handlers[0].rejected({ response: { status: 401 } }).catch(() => {});

    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
    expect(window.location.href).toBe("/login");
  });

  it("does not redirect if already on /login", async () => {
    Object.defineProperty(window, "location", {
      value: { href: "/login", pathname: "/login" },
      writable: true,
      configurable: true,
    });

    const handlers = (apiClient.interceptors.response as unknown as { handlers: Array<{ rejected: (error: unknown) => Promise<unknown> }> }).handlers;
    await handlers[0].rejected({ response: { status: 401 } }).catch(() => {});

    expect(window.location.href).toBe("/login");
  });

  it("passes through non-401 errors", async () => {
    const handlers = (apiClient.interceptors.response as unknown as { handlers: Array<{ rejected: (error: unknown) => Promise<unknown> }> }).handlers;
    await expect(handlers[0].rejected({ response: { status: 500 } })).rejects.toEqual({
      response: { status: 500 },
    });
  });
});
