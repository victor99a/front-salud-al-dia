import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HowToUseSection from '../../../components/Landing/HowToUseSection';

describe('HowToUseSection.jsx', () => {
  it('debe renderizar el encabezado de la guía', () => {
    render(<HowToUseSection />);
    
    expect(screen.getByText('Guía Rápida')).toBeInTheDocument();
    expect(screen.getByText('Toma el control en 3 pasos')).toBeInTheDocument();
  });

  it('debe mostrar los 3 pasos del proceso correctamente', () => {
    render(<HowToUseSection />);
    
    expect(screen.getByText('Entra al Registro')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tus Datos')).toBeInTheDocument();
    expect(screen.getByText('Recibe tu Análisis')).toBeInTheDocument();

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('debe contener las instrucciones detalladas', () => {
    render(<HowToUseSection />);
    
    expect(screen.getByText(/busca la tarjeta que dice/i)).toBeInTheDocument();
    expect(screen.getByText(/El formulario es inteligente/i)).toBeInTheDocument();
    expect(screen.getByText(/te dirá al instante si estás/i)).toBeInTheDocument();
  });
});