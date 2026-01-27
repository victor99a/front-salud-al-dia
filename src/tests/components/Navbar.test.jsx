import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../components/SosButton', () => ({
  default: () => <button data-testid="sos-btn-mock">SOS</button>
}));

describe('Navbar.jsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('debe renderizar enlaces públicos si no hay token (Visitante)', () => {
    render(
      <BrowserRouter>
        <Navbar isUserAdmin={false} userRole={null} />
      </BrowserRouter>
    );

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
    expect(screen.queryByText('Mi Panel')).not.toBeInTheDocument();
  });

  it('debe renderizar menú de Especialista si el rol es specialist', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user_name', 'Dr. Strange');
    
    render(
      <BrowserRouter>
        <Navbar isUserAdmin={false} userRole="specialist" />
      </BrowserRouter>
    );

    expect(screen.getByText('Dr. Strange')).toBeInTheDocument();
    expect(screen.getByText('Profesional')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument(); 
  });

  it('debe renderizar menú de Paciente Logueado', () => {
    localStorage.setItem('token', 'fake-token');
    
    render(
      <BrowserRouter>
        <Navbar isUserAdmin={false} userRole="patient" />
      </BrowserRouter>
    );

    expect(screen.getByText('Mi Panel')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
    expect(screen.getAllByTestId('sos-btn-mock').length).toBeGreaterThan(0);
  });

  it('debe renderizar enlace Admin si es administrador', () => {
    localStorage.setItem('token', 'fake-token');

    render(
      <BrowserRouter>
        <Navbar isUserAdmin={true} userRole="admin" />
      </BrowserRouter>
    );

    expect(screen.getByText('Panel Admin')).toBeInTheDocument();
  });

  it('debe cerrar sesión correctamente y redirigir', () => {
    localStorage.setItem('token', 'fake-token');
    
    render(
      <BrowserRouter>
        <Navbar isUserAdmin={false} userRole="patient" />
      </BrowserRouter>
    );

    const logoutBtn = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem('token')).toBeNull(); 
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('debe abrir y cerrar el menú móvil', () => {
    const { container } = render(
      <BrowserRouter>
        <Navbar isUserAdmin={false} userRole={null} />
      </BrowserRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    const navCollapse = container.querySelector('.nav-collapse');

    fireEvent.click(hamburger);
    expect(navCollapse).toHaveClass('active');

    fireEvent.click(hamburger);
    expect(navCollapse).not.toHaveClass('active');
  });
});