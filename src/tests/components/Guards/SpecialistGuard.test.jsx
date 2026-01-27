import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SpecialistGuard from '../../../components/Guards/SpecialistGuard';

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div>Redirigido a {to}</div>
}));

describe('SpecialistGuard.jsx', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe redirigir al Login si no hay token', () => {
    render(
      <SpecialistGuard>
        <div>Zona Especialista</div>
      </SpecialistGuard>
    );
    expect(screen.getByText('Redirigido a /login')).toBeInTheDocument();
  });

  it('debe sacar al paciente y mandarlo a su dashboard', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user_role', 'patient');

    render(
      <SpecialistGuard>
        <div>Zona Especialista</div>
      </SpecialistGuard>
    );
    expect(screen.getByText('Redirigido a /dashboard')).toBeInTheDocument();
  });

  it('debe dejar entrar al especialista', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user_role', 'specialist');

    render(
      <SpecialistGuard>
        <div>Zona Especialista</div>
      </SpecialistGuard>
    );
    // Aquí validamos que SÍ se muestre el contenido hijo
    expect(screen.getByText('Zona Especialista')).toBeInTheDocument();
  });

  it('debe redirigir al Admin a su propia zona', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user_role', 'admin');

    render(
      <SpecialistGuard>
        <div>Zona Especialista</div>
      </SpecialistGuard>
    );
    
    // El código original manda al admin a "/admin", no lo deja entrar aquí.
    // Así que el test debe esperar esa redirección.
    expect(screen.getByText('Redirigido a /admin')).toBeInTheDocument();
  });
});