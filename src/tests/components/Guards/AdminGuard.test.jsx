import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminGuard from '../../../components/Guards/AdminGuard'; 

// Hacemos un componente falso de Navigate para ver a dónde nos redirige
vi.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div>Redirigido a {to}</div>
}));

describe('AdminGuard.jsx', () => {
  beforeEach(() => {
    // Limpiamos el almacenamiento antes de cada test para que no se mezclen los datos
    localStorage.clear();
  });

  it('te manda al login si no tienes token', () => {
    render(
      <AdminGuard>
        <div>Panel Secreto</div>
      </AdminGuard>
    );
    // Como no pusimos token en localStorage, debe echarnos
    expect(screen.getByText('Redirigido a /login')).toBeInTheDocument();
  });

  it('te manda al dashboard si eres paciente', () => {
    // Preparamos el escenario: usuario logueado pero es paciente
    localStorage.setItem('token', 'token-falso');
    localStorage.setItem('user_role', 'patient');

    render(
      <AdminGuard>
        <div>Panel Secreto</div>
      </AdminGuard>
    );

    expect(screen.getByText('Redirigido a /dashboard')).toBeInTheDocument();
  });

  it('te manda al panel médico si eres especialista', () => {
    // Escenario: usuario es doctor
    localStorage.setItem('token', 'token-falso');
    localStorage.setItem('user_role', 'specialist');

    render(
      <AdminGuard>
        <div>Panel Secreto</div>
      </AdminGuard>
    );

    expect(screen.getByText('Redirigido a /panel-medico')).toBeInTheDocument();
  });

  it('te deja pasar si eres Admin de verdad', () => {
    // Escenario: usuario es el jefe (admin)
    localStorage.setItem('token', 'token-falso');
    localStorage.setItem('user_role', 'admin');

    render(
      <AdminGuard>
        <div>Panel Secreto</div>
      </AdminGuard>
    );

    // Aquí sí debería mostrar el contenido protegido
    expect(screen.getByText('Panel Secreto')).toBeInTheDocument();
  });
});