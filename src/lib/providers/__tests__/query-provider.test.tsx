import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import QueryProvider from "../query-provider";

describe("QueryProvider", () => {
  it("renders children", () => {
    render(
      <QueryProvider>
        <div>Hello World</div>
      </QueryProvider>
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("provides QueryClient context", () => {
    // Just verify it doesn't throw
    const { unmount } = render(
      <QueryProvider>
        <div>Test</div>
      </QueryProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
    unmount();
  });
});
