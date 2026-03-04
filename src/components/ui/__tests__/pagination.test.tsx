import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import Pagination from "../pagination";

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = renderWithProviders(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.querySelector("nav")).toBeNull();
  });

  it("renders page numbers", () => {
    renderWithProviders(
      <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("highlights current page", () => {
    renderWithProviders(
      <Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />
    );
    const currentBtn = screen.getByText("2");
    expect(currentBtn.className).toContain("bg-indigo-600");
  });

  it("calls onPageChange when clicking a page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderWithProviders(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
    );
    await user.click(screen.getByText("3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disables previous button on first page", () => {
    renderWithProviders(
      <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    renderWithProviders(
      <Pagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />
    );
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("shows ellipsis for many pages", () => {
    renderWithProviders(
      <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />
    );
    expect(screen.getAllByText("...").length).toBeGreaterThanOrEqual(1);
  });

  it("calls onPageChange with previous page when clicking prev", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderWithProviders(
      <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />
    );
    await user.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with next page when clicking next", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    renderWithProviders(
      <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />
    );
    await user.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
