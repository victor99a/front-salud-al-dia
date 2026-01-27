import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DrChapatinSection from '../../../components/Landing/DrChapatinSection';

describe('DrChapatinSection.jsx', () => {
  it('debe renderizar el título principal y las badges', () => {
    render(<DrChapatinSection />);
    
    expect(screen.getByText(/No es broma:/i)).toBeInTheDocument();
    expect(screen.getByText(/Ciencia real detrás del personaje/i)).toBeInTheDocument();
    
    expect(screen.getByText('IA Médica Avanzada')).toBeInTheDocument();
    expect(screen.getByText('Modo: Dr. Chapatín')).toBeInTheDocument();
  });

  it('debe mostrar los 3 pilares de confianza (Grid)', () => {
    render(<DrChapatinSection />);
    
    expect(screen.getByText('Protocolos Clínicos')).toBeInTheDocument();
    expect(screen.getByText('Entrenamiento')).toBeInTheDocument();
    expect(screen.getByText('Seguridad')).toBeInTheDocument();
  });

  it('debe mostrar el disclaimer médico legal (CRÍTICO)', () => {
    render(<DrChapatinSection />);
    
    expect(screen.getByText(/no reemplaza una consulta médica presencial/i)).toBeInTheDocument();
  });

  it('debe renderizar la imagen del doctor y la tarjeta flotante', () => {
    render(<DrChapatinSection />);
    
    const image = screen.getByAltText('Dr Chapatín IA');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('chapatin-img');

    expect(screen.getByText('Precisión Analítica')).toBeInTheDocument();
    expect(screen.getByText(/98% en detección/i)).toBeInTheDocument();
  });
});