import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import PatientGuard from '../../../components/Guards/PatientGuard';

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div>Redirigido a {to}</div>
}));

describe('PatientGuard.jsx', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe redirigir al login si no hay token', () => {
    render(
      <PatientGuard>
        <div>Contenido Secreto</div>
      </PatientGuard>
    );

    expect(screen.queryByText('Contenido Secreto')).not.toBeInTheDocument();
    expect(screen.getByText('Redirigido a /login')).toBeInTheDocument();
  });

  it('debe renderizar el contenido (children) si hay token', () => {
    localStorage.setItem('token', 'fake-token-123');

    render(
      <PatientGuard>
        <div>Contenido Secreto</div>
      </PatientGuard>
    );

    expect(screen.getByText('Contenido Secreto')).toBeInTheDocument();
    expect(screen.queryByText(/Redirigido/)).not.toBeInTheDocument();
  });
});