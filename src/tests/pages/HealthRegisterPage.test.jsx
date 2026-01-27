import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HealthRegisterPage from '../../pages/HealthRegisterPage';

// Mockeamos el formulario para probar solo la página contenedora
vi.mock('../../components/Dashboard/HealthRegisterForm', () => ({
  default: () => <div data-testid="health-form-mock">HealthRegisterForm Mock</div>,
}));

describe('HealthRegisterPage', () => {
  
  it('renderiza el título, la descripción y el formulario', () => {
    render(<HealthRegisterPage />);

    expect(screen.getByText(/Registrar Información de Salud/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Ingresa tus valores de glucosa y presión arterial/i)).toBeInTheDocument();

    expect(screen.getByTestId('health-form-mock')).toBeInTheDocument();
  });
});