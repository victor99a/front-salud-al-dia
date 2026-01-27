import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PressureCard from "../../components/Dashboard/PressureCard";

// 👇 mock CORRECTO (misma ruta exacta)
vi.mock("../../utils/formatDate", () => ({
  formatDateLong: vi.fn(() => "1 de enero de 2024"),
}));

import { formatDateLong } from "../../utils/formatDate";

describe("PressureCard", () => {
  it("renderiza presión normal correctamente", () => {
    render(
      <PressureCard
        systolic={120}
        diastolic={80}
        date={new Date()}
      />
    );

    // Texto principal
    expect(screen.getByText("Presión Arterial")).toBeInTheDocument();
    expect(screen.getByText("120/80 mmHg")).toBeInTheDocument();

    // Estado
    expect(screen.getByText("Normal")).toBeInTheDocument();

    // Fecha mockeada
    expect(screen.getByText("1 de enero de 2024")).toBeInTheDocument();

    // Verificamos que el helper fue llamado
    expect(formatDateLong).toHaveBeenCalled();
  });

  it("muestra alerta cuando la presión es elevada", () => {
    render(
      <PressureCard
        systolic={135}
        diastolic={88}
        date={new Date()}
      />
    );

    expect(screen.getByText("Alerta")).toBeInTheDocument();
  });

  it("muestra peligro cuando la presión es alta", () => {
    render(
      <PressureCard
        systolic={150}
        diastolic={95}
        date={new Date()}
      />
    );

    expect(screen.getByText("Peligro")).toBeInTheDocument();
  });
});
