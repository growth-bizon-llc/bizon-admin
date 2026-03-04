import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent, waitFor } from "@/test-utils";
import StoreForm from "../store-form";
import type { Store } from "@/lib/api/types";

const mockStore: Store = {
  id: 1,
  name: "My Store",
  slug: "my-store",
  custom_domain: "store.example.com",
  subdomain: "mystore",
  description: "A great store",
  currency: "USD",
  locale: "en",
  settings: { theme: "dark" },
  active: true,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
};

describe("StoreForm", () => {
  it("renders form fields", () => {
    renderWithProviders(
      <StoreForm store={mockStore} onSubmit={vi.fn()} />
    );
    expect(screen.getByLabelText("Store Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Custom Domain")).toBeInTheDocument();
    expect(screen.getByLabelText("Subdomain")).toBeInTheDocument();
    expect(screen.getByLabelText("Currency")).toBeInTheDocument();
    expect(screen.getByLabelText("Locale")).toBeInTheDocument();
  });

  it("pre-fills form with store data", () => {
    renderWithProviders(
      <StoreForm store={mockStore} onSubmit={vi.fn()} />
    );
    expect(screen.getByDisplayValue("My Store")).toBeInTheDocument();
    expect(screen.getByDisplayValue("store.example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("mystore")).toBeInTheDocument();
  });

  it("renders save button", () => {
    renderWithProviders(
      <StoreForm store={mockStore} onSubmit={vi.fn()} />
    );
    expect(screen.getByText("Save Settings")).toBeInTheDocument();
  });

  it("renders settings JSON", () => {
    renderWithProviders(
      <StoreForm store={mockStore} onSubmit={vi.fn()} />
    );
    expect(screen.getByLabelText("Settings (JSON)")).toBeInTheDocument();
  });

  it("shows loading state on submit button", () => {
    renderWithProviders(
      <StoreForm store={mockStore} onSubmit={vi.fn()} loading={true} />
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("submits form with parsed settings", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(
      <StoreForm store={mockStore} onSubmit={onSubmit} />
    );

    await user.click(screen.getByText("Save Settings"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    const payload = onSubmit.mock.calls[0][0];
    expect(payload.name).toBe("My Store");
    expect(payload.settings).toEqual({ theme: "dark" });
  });

  it("handles invalid JSON settings gracefully", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(
      <StoreForm store={mockStore} onSubmit={onSubmit} />
    );

    // Clear settings and type invalid JSON
    const settingsField = screen.getByLabelText("Settings (JSON)");
    await user.clear(settingsField);
    await user.type(settingsField, "not valid json");

    await user.click(screen.getByText("Save Settings"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    const payload = onSubmit.mock.calls[0][0];
    expect(payload.settings).toEqual({});
  });

  it("renders active toggle", () => {
    renderWithProviders(
      <StoreForm store={mockStore} onSubmit={vi.fn()} />
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("handles empty custom_domain and subdomain", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const storeNoCustom = { ...mockStore, custom_domain: null, subdomain: null };
    renderWithProviders(
      <StoreForm store={storeNoCustom} onSubmit={onSubmit} />
    );

    await user.click(screen.getByText("Save Settings"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    const payload = onSubmit.mock.calls[0][0];
    expect(payload.custom_domain).toBeNull();
    expect(payload.subdomain).toBeNull();
  });
});
