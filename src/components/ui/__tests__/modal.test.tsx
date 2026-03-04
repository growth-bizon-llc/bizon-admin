import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import Modal from "../modal";

describe("Modal", () => {
  it("renders title and children when open", () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    renderWithProviders(
      <Modal open={false} onClose={vi.fn()} title="Hidden">
        <p>Hidden content</p>
      </Modal>
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("calls onClose when close button clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(
      <Modal open={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    // Click the X button
    const closeButtons = screen.getAllByRole("button");
    await user.click(closeButtons[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders without title", () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()}>
        <p>No title content</p>
      </Modal>
    );
    expect(screen.getByText("No title content")).toBeInTheDocument();
  });
});
