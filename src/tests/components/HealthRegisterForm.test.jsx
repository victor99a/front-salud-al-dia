import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HealthRegisterForm from "../../components/Dashboard/HealthRegisterForm";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("HealthRegisterForm", () => {
  beforeEach(() => {
    // Mock localStorage
    localStorage.setItem("user_id", "1");
    localStorage.setItem("token", "fake-token");

    // Mock alert
    vi.spyOn(window, "alert").mockImplementation(() => {});

    // Reset mocks
    vi.clearAllMocks();
  });

  it("renderiza los inputs y el botón", () => {
    render(<HealthRegisterForm />);

    expect(screen.getByPlaceholderText("Ej: 120")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sistólica (Ej: 120)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Diastólica (Ej: 80)")).toBeInTheDocument();
    expect(screen.getByText("Guardar Registro")).toBeInTheDocument();
  });

  it("muestra alerta si los valores son menores o iguales a 0", async () => {
  render(<HealthRegisterForm />);

  fireEvent.change(screen.getByPlaceholderText("Ej: 120"), {
    target: { value: "0" },
  });

  fireEvent.change(screen.getByPlaceholderText("Sistólica (Ej: 120)"), {
    target: { value: "120" },
  });

  fireEvent.change(screen.getByPlaceholderText("Diastólica (Ej: 80)"), {
    target: { value: "80" },
  });

  fireEvent.submit(screen.getByRole("button", { name: /guardar registro/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith(
      "Los valores de salud deben ser mayores a 0"
    );
  });

  expect(axios.post).not.toHaveBeenCalled();
});


  it("envía los datos correctamente y limpia el formulario", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<HealthRegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Ej: 120"), {
      target: { value: "110" },
    });

    fireEvent.change(screen.getByPlaceholderText("Sistólica (Ej: 120)"), {
      target: { value: "120" },
    });

    fireEvent.change(screen.getByPlaceholderText("Diastólica (Ej: 80)"), {
      target: { value: "80" },
    });

    fireEvent.click(screen.getByText("Guardar Registro"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/registros"),
      {
        patientId: "1",
        glucosa: 110,
        sistolica: 120,
        diastolica: 80,
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-token",
        }),
      })
    );

    expect(window.alert).toHaveBeenCalledWith("Registro guardado correctamente");

    // Inputs limpios
    expect(screen.getByPlaceholderText("Ej: 120").value).toBe("");
    expect(screen.getByPlaceholderText("Sistólica (Ej: 120)").value).toBe("");
    expect(screen.getByPlaceholderText("Diastólica (Ej: 80)").value).toBe("");
  });

  it("muestra alerta si ocurre un error al guardar", async () => {
    axios.post.mockRejectedValueOnce(new Error("Error backend"));

    render(<HealthRegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Ej: 120"), {
      target: { value: "100" },
    });

    fireEvent.change(screen.getByPlaceholderText("Sistólica (Ej: 120)"), {
      target: { value: "120" },
    });

    fireEvent.change(screen.getByPlaceholderText("Diastólica (Ej: 80)"), {
      target: { value: "80" },
    });

    fireEvent.click(screen.getByText("Guardar Registro"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error al guardar registro");
    });
  });
});
