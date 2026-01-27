import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PatientFile from "../../pages/PatientFile";
import {
  getMedicalRecord,
  getPatientDashboardData,
  getPatientHistory,
  getPatientById,
} from "../../services/SpecialistService";

// Mockeamos el router para simular que estamos visitando el perfil del usuario "123"
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "123" }),
  useNavigate: () => vi.fn(),
}));

// Mockeamos todos los servicios para no depender del backend real
vi.mock("../../services/SpecialistService", () => ({
  getMedicalRecord: vi.fn(),
  getPatientDashboardData: vi.fn(),
  getPatientHistory: vi.fn(),
  getPatientById: vi.fn(),
  getDownloadUrl: vi.fn(() => "http://fake-url/pdf"),
}));

// Mockeamos las tarjetas del dashboard para no probar su lógica interna aquí
vi.mock("../../components/Dashboard/GlucoseCard", () => ({
  default: () => <div data-testid="glucose-card">GlucoseCard</div>,
}));

vi.mock("../../components/Dashboard/PressureCard", () => ({
  default: () => <div data-testid="pressure-card">PressureCard</div>,
}));

describe("PatientFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "fake-token");
  });

  it("muestra el mensaje de carga al iniciar", () => {
    // Dejamos las promesas pendientes para que el componente se quede en estado "loading"
    getMedicalRecord.mockReturnValue(new Promise(() => {}));
    getPatientById.mockReturnValue(new Promise(() => {}));

    render(<PatientFile />);

    expect(screen.getByText(/Cargando información clínica/i)).toBeInTheDocument();
  });

  it("muestra mensaje de ficha médica inexistente pero carga los datos básicos", async () => {
    // Caso: El usuario existe (profile) pero no tiene ficha médica (null)
    getMedicalRecord.mockResolvedValueOnce(null);
    getPatientDashboardData.mockResolvedValueOnce({});
    getPatientHistory.mockResolvedValueOnce([]);
    getPatientById.mockResolvedValueOnce({
      first_names: "Maria",
      last_names: "Gonzalez",
      rut: "11.222.333-K"
    });

    render(<PatientFile />);

    await waitFor(() => {
      // Esperamos que se vaya el loader
      expect(screen.queryByText(/Cargando información/i)).not.toBeInTheDocument();
    });

    // Verificamos que cargó el nombre aunque no tenga ficha
    expect(screen.getByText(/Paciente: Maria Gonzalez/i)).toBeInTheDocument();
    
    // Y que muestre el aviso de que falta la ficha
    expect(screen.getByText(/Ficha Médica Inexistente/i)).toBeInTheDocument();
  });

  it("renderiza la ficha clínica completa del paciente cuando hay datos", async () => {
    // Simulamos que la API responde con todo perfecto
    getMedicalRecord.mockResolvedValueOnce({
      blood_type: "A+",
      allergies: "Polen",
      chronic_diseases: "Asma",
      initial_weight: 80,
      height: 180,
      emergency_contact_name: "Pedro",
      emergency_contact_phone: "+56912345678"
    });

    getPatientDashboardData.mockResolvedValueOnce({
      glucose: { value: 110, date: new Date() },
      pressure: { systolic: 120, diastolic: 80, date: new Date() },
    });

    getPatientHistory.mockResolvedValueOnce([
        { date: '2024-01-01', glucose: 100, systolic: 120, diastolic: 80 }
    ]);
    
    getPatientById.mockResolvedValueOnce({
      first_names: "Juan",
      last_names: "Pérez",
      rut: "12.345.678-9",
    });

    render(<PatientFile />);

    await waitFor(() => {
      expect(screen.getByText(/Paciente: Juan Pérez/i)).toBeInTheDocument();
    });

    // Revisamos que pinte los datos médicos
    expect(screen.getByText("A+")).toBeInTheDocument();
    expect(screen.getByText("Asma")).toBeInTheDocument();
    expect(screen.getByText("80 kg")).toBeInTheDocument();
    
    // Revisamos que las tarjetas y el contacto estén ahí
    expect(screen.getByTestId("glucose-card")).toBeInTheDocument();
    expect(screen.getByText("Pedro")).toBeInTheDocument();
  });
});