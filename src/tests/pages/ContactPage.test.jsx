import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from '../../pages/ContactPage';

describe('ContactPage', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renderiza correctamente las secciones principales', () => {
    render(<ContactPage />);
    expect(screen.getByText(/Centro de Ayuda/i)).toBeInTheDocument();
    expect(screen.getByText(/Reportar un Problema/i)).toBeInTheDocument();
    expect(screen.getByText(/Gestión de Cuenta/i)).toBeInTheDocument();
    expect(screen.getByText(/Preguntas Frecuentes/i)).toBeInTheDocument();
  });

  it('abre y cierra las preguntas frecuentes (FAQ) al hacer click', () => {
    render(<ContactPage />);

    const questionButton = screen.getByRole('button', { 
        name: /¿Cómo registro mi presión arterial o glucosa\?/i 
    });
    
    const answerDiv = screen.getByText(/Ve a tu 'Mi Panel' y busca la tarjeta/i);

    // Verificamos el flujo: Cerrado -> Abierto -> Cerrado
    expect(answerDiv).not.toHaveClass('open');

    fireEvent.click(questionButton);
    expect(answerDiv).toHaveClass('open');

    fireEvent.click(questionButton);
    expect(answerDiv).not.toHaveClass('open');
  });

  it('envía el formulario de reporte y muestra una alerta', () => {
    render(<ContactPage />);

    fireEvent.change(screen.getByPlaceholderText(/Ej: Error al guardar datos/i), {
      target: { value: 'Error en el login' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/Describe el problema.../i), {
      target: { value: 'No puedo entrar a mi cuenta.' }
    });

    const submitBtn = screen.getByRole('button', { name: /Enviar Reporte/i });
    fireEvent.click(submitBtn);

    expect(window.alert).toHaveBeenCalledWith('¡Gracias! Mensaje enviado al equipo técnico.');
  });
});