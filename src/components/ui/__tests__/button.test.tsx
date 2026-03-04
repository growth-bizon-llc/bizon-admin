import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import Button from "../button";

describe("Button", () => {
  it("renders children", () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is true", () => {
    renderWithProviders(<Button disabled>Click</Button>);
    expect(screen.getByText("Click")).toBeDisabled();
  });

  it("is disabled when loading", () => {
    renderWithProviders(<Button loading>Click</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows spinner when loading", () => {
    renderWithProviders(<Button loading>Click</Button>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies variant styles", () => {
    renderWithProviders(<Button variant="danger">Delete</Button>);
    const btn = screen.getByText("Delete");
    expect(btn.className).toContain("bg-red-600");
  });

  it("applies size styles", () => {
    renderWithProviders(<Button size="lg">Big</Button>);
    const btn = screen.getByText("Big");
    expect(btn.className).toContain("px-6");
  });

  it("applies custom className", () => {
    renderWithProviders(<Button className="custom-class">Test</Button>);
    expect(screen.getByText("Test").className).toContain("custom-class");
  });
});
