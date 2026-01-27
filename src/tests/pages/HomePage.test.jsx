import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import HomePage from "../../pages/HomePage";


vi.mock("../../assets/carrusel-1.png", () => ({
  default: "carrusel1.png",
}));

vi.mock("../../assets/imagen2.png", () => ({
  default: "carrusel2.png",
}));

vi.mock("../../assets/carrusel-3.png", () => ({
  default: "carrusel3.png",
}));


vi.mock("../../components/Landing/DrChapatinSection", () => ({
  default: () => <div>DrChapatinSection</div>,
}));

vi.mock("../../components/Landing/HowToUseSection", () => ({
  default: () => <div>HowToUseSection</div>,
}));



const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("HomePage", () => {
  test("renderiza el contenido principal correctamente", () => {
    renderWithRouter(<HomePage />);

    expect(
      screen.getByText(/Monitorea tu Presión y Glucosa/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Comenzar Ahora/i })
    ).toBeInTheDocument();
  });

  test("muestra los componentes secundarios", () => {
    renderWithRouter(<HomePage />);

    expect(screen.getByText("DrChapatinSection")).toBeInTheDocument();
    expect(screen.getByText("HowToUseSection")).toBeInTheDocument();
  });

  test("cambia de slide al hacer clic en la flecha derecha", () => {
    renderWithRouter(<HomePage />);

    const nextButton = screen.getByText("❯");
    fireEvent.click(nextButton);

    expect(
      screen.getByText(/Análisis Clínico en Lenguaje Simple/i)
    ).toBeInTheDocument();
  });

  test("cambia de slide al hacer clic en un dot", () => {
    renderWithRouter(<HomePage />);

    const dots = screen.getAllByClassName
      ? screen.getAllByClassName("dot")
      : document.querySelectorAll(".dot");

    fireEvent.click(dots[2]);

    expect(
      screen.getByText(/Tus Datos Médicos están Seguros/i)
    ).toBeInTheDocument();
  });

  test("permite hacer clic en el botón 'Comenzar Ahora'", () => {
    renderWithRouter(<HomePage />);

    const button = screen.getByRole("button", { name: /Comenzar Ahora/i });
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });
});
