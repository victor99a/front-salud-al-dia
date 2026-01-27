// Tests unitarios de la página PatientFile
// - Estado de carga
// - Ficha médica inexistente
// - Render de datos del paciente

import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PatientFile from "../../pages/PatientFile";

// 🔹 Mock de react-router-dom
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "123" }),
  useNavigate: () => vi.fn(),
}));

// 🔹 Mock de servicios
vi.mock("../../services/SpecialistService", () => ({
  getMedicalRecord: vi.fn(),
  getPatientDashboardData: vi.fn(),
  getPatientHistory: vi.fn(),
  getPatientById: vi.fn(),
  getDownloadUrl: vi.fn(() => "http://fake-url/pdf"),
}));

// 🔹 Mock de componentes hijos
vi.mock("../../components/Dashboard/GlucoseCard", () => ({
  default: () => <div>GlucoseCard</div>,
}));

vi.mock("../../components/Dashboard/PressureCard", () => ({
  default: () => <div>PressureCard</div>,
}));

// Importamos los mocks ya definidos
import {
  getMedicalRecord,
  getPatientDashboardData,
  getPatientHistory,
  getPatientById,
} from "../../services/SpecialistService";

describe("PatientFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "fake-token");
  });

  it("muestra el mensaje de carga al iniciar", () => {
    getMedicalRecord.mockResolvedValueOnce(null);
    getPatientDashboardData.mockResolvedValueOnce({});
    getPatientHistory.mockResolvedValueOnce([]);
    getPatientById.mockResolvedValueOnce(null);

    render(<PatientFile />);

    expect(
      screen.getByText(/verificando datos en la base de datos/i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje de ficha médica inexistente", async () => {
    getMedicalRecord.mockResolvedValueOnce(null);
    getPatientDashboardData.mockResolvedValueOnce({});
    getPatientHistory.mockResolvedValueOnce([]);
    getPatientById.mockResolvedValueOnce({
      first_names: "Juan",
      last_names: "Pérez",
    });

    render(<PatientFile />);

    await waitFor(() => {
      expect(
        screen.getByText(/ficha médica inexistente/i)
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/no ha completado su registro inicial de salud/i)
    ).toBeInTheDocument();
  });

  it("renderiza la ficha clínica del paciente cuando hay datos", async () => {
  getMedicalRecord.mockResolvedValueOnce({
    blood_type: "O+",
    allergies: "Polen",
    chronic_diseases: "Asma",
    initial_weight: 70,
    height: 170,
  });

  getPatientDashboardData.mockResolvedValueOnce({
    glucose: { value: 110, date: new Date() },
    pressure: { systolic: 120, diastolic: 80, date: new Date() },
  });

  getPatientHistory.mockResolvedValueOnce([]);
  getPatientById.mockResolvedValueOnce({
    first_names: "Juan",
    last_names: "Pérez",
    rut: "12.345.678-9",
  });

  render(<PatientFile />);

  await waitFor(() => {
    expect(
      screen.getByText(/paciente:\s*juan pérez/i)
    ).toBeInTheDocument();
  });

  expect(screen.getByText("O+")).toBeInTheDocument();
  expect(screen.getByText("GlucoseCard")).toBeInTheDocument();
  expect(screen.getByText("PressureCard")).toBeInTheDocument();
});

});
