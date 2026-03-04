import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test-utils";
import Select from "../select";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

describe("Select", () => {
  it("renders options", () => {
    renderWithProviders(<Select options={options} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("renders label", () => {
    renderWithProviders(<Select id="test" label="Choose" options={options} />);
    expect(screen.getByLabelText("Choose")).toBeInTheDocument();
  });

  it("renders placeholder option", () => {
    renderWithProviders(<Select options={options} placeholder="Select one" />);
    expect(screen.getByText("Select one")).toBeInTheDocument();
  });

  it("shows error", () => {
    renderWithProviders(<Select options={options} error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("handles selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<Select options={options} onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "b");
    expect(onChange).toHaveBeenCalled();
  });
});
