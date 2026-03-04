import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../data-table";

interface TestRow {
  id: number;
  name: string;
}

const columnHelper = createColumnHelper<TestRow>();
const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Name" }),
];

describe("DataTable", () => {
  it("renders headers", () => {
    renderWithProviders(<DataTable data={[]} columns={columns} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("renders data rows", () => {
    const data = [
      { id: 1, name: "Alpha" },
      { id: 2, name: "Beta" },
    ];
    renderWithProviders(<DataTable data={data} columns={columns} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("shows empty message when no data", () => {
    renderWithProviders(<DataTable data={[]} columns={columns} />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("calls onRowClick when a row is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const data = [{ id: 1, name: "Test" }];
    renderWithProviders(<DataTable data={data} columns={columns} onRowClick={onClick} />);
    await user.click(screen.getByText("Test"));
    expect(onClick).toHaveBeenCalledWith({ id: 1, name: "Test" });
  });

  it("adds cursor-pointer class when onRowClick is provided", () => {
    const data = [{ id: 1, name: "Test" }];
    renderWithProviders(<DataTable data={data} columns={columns} onRowClick={vi.fn()} />);
    const row = screen.getByText("Test").closest("tr");
    expect(row?.className).toContain("cursor-pointer");
  });
});
