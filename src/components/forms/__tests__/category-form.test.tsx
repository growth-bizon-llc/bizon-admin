import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent, waitFor } from "@/test-utils";
import CategoryForm from "../category-form";
import type { Category } from "@/lib/api/types";

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Shoes",
    slug: "shoes",
    description: "",
    position: 0,
    active: true,
    parent_id: null,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    children_count: 0,
    products_count: 5,
  },
];

describe("CategoryForm", () => {
  it("renders form fields", () => {
    renderWithProviders(
      <CategoryForm categories={[]} onSubmit={vi.fn()} />
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Parent Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Position")).toBeInTheDocument();
  });

  it("renders create button for new category", () => {
    renderWithProviders(
      <CategoryForm categories={[]} onSubmit={vi.fn()} />
    );
    expect(screen.getByText("Create Category")).toBeInTheDocument();
  });

  it("renders update button for existing category", () => {
    renderWithProviders(
      <CategoryForm category={mockCategories[0]} categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByText("Update Category")).toBeInTheDocument();
  });

  it("pre-fills form with existing category data", () => {
    renderWithProviders(
      <CategoryForm category={mockCategories[0]} categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByDisplayValue("Shoes")).toBeInTheDocument();
  });

  it("shows validation error for empty name", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CategoryForm categories={[]} onSubmit={vi.fn()} />
    );
    await user.click(screen.getByText("Create Category"));
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("calls onSubmit with form data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(
      <CategoryForm categories={[]} onSubmit={onSubmit} />
    );
    await user.type(screen.getByLabelText("Name"), "New Category");
    await user.click(screen.getByText("Create Category"));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: "New Category" })
      );
    });
  });

  it("excludes current category from parent options on edit", () => {
    renderWithProviders(
      <CategoryForm category={mockCategories[0]} categories={mockCategories} onSubmit={vi.fn()} />
    );
    const select = screen.getByLabelText("Parent Category");
    const options = select.querySelectorAll("option");
    // Should only have the placeholder, not the category itself
    const optionValues = Array.from(options).map((o) => o.textContent);
    expect(optionValues).not.toContain("Shoes");
  });
});
