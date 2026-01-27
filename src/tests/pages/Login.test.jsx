import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../pages/LoginPage'; 

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children }) => <a href="#">{children}</a>, 
}));

vi.mock('../../services/AuthService', () => ({
  requestPublicPasswordReset: vi.fn(),
  getUserProfile: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('../../assets/logo.png', () => ({
  default: 'logo.png',
}));

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear(); 
  });

  it('renderiza el formulario de login correctamente', () => {
    render(<Login />);

    const logo = screen.getByRole('img', { name: /Salud Al Día/i });
    expect(logo).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/ejemplo@correo.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Entrar al Panel/i })).toBeInTheDocument();
  });

  it('muestra el modal de recuperación al hacer clic en "¿Olvidaste tu contraseña?"', () => {
    render(<Login />);

    // Nos aseguramos que al principio NO esté visible
    expect(screen.queryByText(/Recuperar Contraseña/i)).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /¿Olvidaste tu contraseña\?/i })
    );

    // Ahora sí debería aparecer
    expect(screen.getByText(/Recuperar Contraseña/i)).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText(/tu@correo.com/i)).toBeInTheDocument();
  });
});