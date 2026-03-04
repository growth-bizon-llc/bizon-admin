import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import ProductForm from "../product-form";
import type { Product, Category } from "@/lib/api/types";

vi.mock("@/lib/api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "",
    parent_id: null,
    position: 0,
    active: true,
    products_count: 5,
    children_count: 0,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 2,
    name: "Clothing",
    slug: "clothing",
    description: "",
    parent_id: null,
    position: 1,
    active: true,
    products_count: 3,
    children_count: 0,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
];

const mockProduct: Product = {
  id: 1,
  name: "Test Widget",
  slug: "test-widget",
  description: "A test product",
  short_description: "Short desc",
  sku: "TW-001",
  barcode: "1234567890",
  base_price: { amount: 25.0, currency: "USD" },
  compare_at_price: { amount: 35.0, currency: "USD" },
  status: "active",
  featured: true,
  track_inventory: true,
  quantity: 100,
  category: { id: 1, name: "Electronics", slug: "electronics", position: 0, active: true, parent_id: null },
  position: 0,
  published_at: null,
  images: [],
  variants: [],
  custom_attributes: { color: "blue", material: "metal" },
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
};

describe("ProductForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders create form with all sections", () => {
    renderWithProviders(
      <ProductForm categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByText("General Information")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("Organization")).toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();
    expect(screen.getByText("Images")).toBeInTheDocument();
    expect(screen.getByText("Custom Attributes")).toBeInTheDocument();
    expect(screen.getByText("Create Product")).toBeInTheDocument();
  });

  it("renders edit form with pre-filled data", () => {
    renderWithProviders(
      <ProductForm product={mockProduct} categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByDisplayValue("Test Widget")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A test product")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Short desc")).toBeInTheDocument();
    expect(screen.getByDisplayValue("TW-001")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
    expect(screen.getByText("Update Product")).toBeInTheDocument();
  });

  it("renders category options", () => {
    renderWithProviders(
      <ProductForm categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();
  });

  it("shows quantity field when track_inventory is on", () => {
    renderWithProviders(
      <ProductForm product={mockProduct} categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByLabelText("Quantity")).toBeInTheDocument();
  });

  it("does not show variants section on create", () => {
    renderWithProviders(
      <ProductForm categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.queryByText("Variants")).not.toBeInTheDocument();
  });

  it("shows variants section on edit", () => {
    renderWithProviders(
      <ProductForm product={mockProduct} categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByText("Variants")).toBeInTheDocument();
    expect(screen.getByText("Add Variant")).toBeInTheDocument();
  });

  it("renders custom attributes from product", () => {
    renderWithProviders(
      <ProductForm product={mockProduct} categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByDisplayValue("color")).toBeInTheDocument();
    expect(screen.getByDisplayValue("blue")).toBeInTheDocument();
    expect(screen.getByDisplayValue("material")).toBeInTheDocument();
    expect(screen.getByDisplayValue("metal")).toBeInTheDocument();
  });

  it("adds custom attribute entry", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ProductForm categories={mockCategories} onSubmit={vi.fn()} />
    );
    await user.click(screen.getByText("Add Attribute"));
    const inputs = screen.getAllByPlaceholderText("Key");
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it("shows product variants with edit/delete buttons", () => {
    const productWithVariants: Product = {
      ...mockProduct,
      variants: [
        {
          id: 1,
          name: "Small",
          sku: "TW-SM",
          price: { amount: 20.0, currency: "USD" },
          compare_at_price: null,
          track_inventory: false,
          quantity: 0,
          position: 0,
          options: { size: "S" },
          active: true,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ],
    };
    renderWithProviders(
      <ProductForm product={productWithVariants} categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("SKU: TW-SM")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders status select with options", () => {
    renderWithProviders(
      <ProductForm categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Archived")).toBeInTheDocument();
  });

  it("renders submit button with loading state", () => {
    renderWithProviders(
      <ProductForm categories={mockCategories} onSubmit={vi.fn()} loading={true} />
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("removes custom attribute entry", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ProductForm product={mockProduct} categories={mockCategories} onSubmit={vi.fn()} />
    );
    // Should have 2 attribute entries (color and material)
    const keysBefore = screen.getAllByPlaceholderText("Key");
    expect(keysBefore).toHaveLength(2);

    // Click the first remove attribute button (trash icon button)
    const removeButtons = screen.getAllByRole("button").filter(
      btn => btn.closest("section")?.textContent?.includes("Custom Attributes") &&
        btn.querySelector("svg") && btn.className.includes("text-red-500")
    );
    await user.click(removeButtons[0]);

    const keysAfter = screen.getAllByPlaceholderText("Key");
    expect(keysAfter).toHaveLength(1);
  });

  it("updates custom attribute key and value", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ProductForm categories={mockCategories} onSubmit={vi.fn()} />
    );
    // Add attribute
    await user.click(screen.getByText("Add Attribute"));
    const keyInput = screen.getByPlaceholderText("Key");
    const valueInput = screen.getByPlaceholderText("Value");
    await user.type(keyInput, "size");
    expect(keyInput).toHaveValue("size");
    await user.type(valueInput, "large");
    expect(valueInput).toHaveValue("large");
  });

  it("shows variant form when Add Variant is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ProductForm product={mockProduct} categories={mockCategories} onSubmit={vi.fn()} />
    );
    await user.click(screen.getByText("Add Variant"));
    // Variant form should appear - check for variant-specific elements
    expect(screen.getByText("Options")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Key (e.g. Size)")).toBeInTheDocument();
  });

  it("renders product with images showing delete button", () => {
    const productWithImages: Product = {
      ...mockProduct,
      images: [
        { id: 1, url: "/img1.jpg", alt_text: "Image 1", position: 0, created_at: "2024-01-01", updated_at: "2024-01-01" },
      ],
    };
    renderWithProviders(
      <ProductForm product={productWithImages} categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByAltText("Image 1")).toBeInTheDocument();
  });

  it("renders product without custom_attributes", () => {
    const productNoAttrs = { ...mockProduct, custom_attributes: {} as Record<string, string> };
    renderWithProviders(
      <ProductForm product={productNoAttrs} categories={mockCategories} onSubmit={vi.fn()} />
    );
    expect(screen.getByText("Custom Attributes")).toBeInTheDocument();
    // Should have no key/value inputs
    expect(screen.queryByPlaceholderText("Key")).not.toBeInTheDocument();
  });

  it("renders without product for create mode", () => {
    renderWithProviders(
      <ProductForm categories={mockCategories} onSubmit={vi.fn()} />
    );
    // No quantity field since track_inventory defaults to false
    expect(screen.queryByLabelText("Quantity")).not.toBeInTheDocument();
  });
});
