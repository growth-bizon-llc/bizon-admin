import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import ImageUpload from "../image-upload";

describe("ImageUpload", () => {
  it("renders dropzone text", () => {
    renderWithProviders(<ImageUpload onFilesSelected={vi.fn()} />);
    expect(screen.getByText("Drag & drop images, or click to select")).toBeInTheDocument();
  });

  it("renders existing previews", () => {
    renderWithProviders(
      <ImageUpload
        onFilesSelected={vi.fn()}
        previews={["/img1.jpg", "/img2.jpg"]}
      />
    );
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("alt", "Preview 1");
    expect(images[1]).toHaveAttribute("alt", "Preview 2");
  });

  it("renders remove button for previews when handler provided", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderWithProviders(
      <ImageUpload
        onFilesSelected={vi.fn()}
        previews={["/img1.jpg"]}
        onRemovePreview={onRemove}
      />
    );
    // Find the remove button within the preview grid
    const removeButtons = document.querySelectorAll("button");
    // Click the remove button (last one is for the preview)
    const removeBtn = removeButtons[removeButtons.length - 1];
    await user.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it("does not render remove button when no onRemovePreview handler", () => {
    renderWithProviders(
      <ImageUpload
        onFilesSelected={vi.fn()}
        previews={["/img1.jpg"]}
      />
    );
    // The grid should exist with img but no button inside the grid
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    // No button siblings in the preview container
    const previewContainer = img.closest(".relative");
    expect(previewContainer?.querySelector("button")).toBeNull();
  });

  it("calls onFilesSelected when files are dropped", async () => {
    const onFilesSelected = vi.fn();
    renderWithProviders(<ImageUpload onFilesSelected={onFilesSelected} />);

    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    expect(input).toBeTruthy();

    const file = new File(["test"], "test.png", { type: "image/png" });
    await userEvent.upload(input, file);

    await vi.waitFor(() => {
      expect(onFilesSelected).toHaveBeenCalledWith([file]);
    });
  });

  it("renders no preview grid when no previews", () => {
    const { container } = renderWithProviders(
      <ImageUpload onFilesSelected={vi.fn()} />
    );
    expect(container.querySelector(".grid")).toBeNull();
  });
});
