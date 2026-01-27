import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GlucoseCard from "../../../components/Dashboard/GlucoseCard";

vi.mock("../../../utils/formatDate", () => ({
  formatDateLong: () => "01 de enero de 2026",
}));

vi.mock("react-icons/fa", () => ({
  FaTint: () => <span data-testid="fa-tint-icon" />,
}));

describe("GlucoseCard", () => {
  it("muestra estado Normal cuando la glucosa es menor a 141", () => {
    render(<GlucoseCard glucose={120} date={new Date()} />);

    expect(screen.getByText("Glucosa")).toBeInTheDocument();
    expect(screen.getByText("120 mg/dL")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();

    expect(screen.getByText("01 de enero de 2026")).toBeInTheDocument();
  });

  it("muestra estado Alerta cuando la glucosa es entre 141 y 199", () => {
    render(<GlucoseCard glucose={150} date={new Date()} />);

    expect(screen.getByText("150 mg/dL")).toBeInTheDocument();
    expect(screen.getByText("Alerta")).toBeInTheDocument();
  });

  it("muestra estado Peligro cuando la glucosa es mayor o igual a 200", () => {
    render(<GlucoseCard glucose={220} date={new Date()} />);

    expect(screen.getByText("220 mg/dL")).toBeInTheDocument();
    expect(screen.getByText("Peligro")).toBeInTheDocument();
  });
});