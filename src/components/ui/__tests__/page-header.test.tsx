import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import PageHeader from "../page-header";

describe("PageHeader", () => {
  it("renders title", () => {
    renderWithProviders(<PageHeader title="Products" />);
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    renderWithProviders(<PageHeader title="Products" description="Manage products" />);
    expect(screen.getByText("Manage products")).toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    renderWithProviders(
      <PageHeader title="Test" actions={<button>Add</button>} />
    );
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    renderWithProviders(<PageHeader title="Products" />);
    expect(screen.queryByText("Manage products")).not.toBeInTheDocument();
  });
});
