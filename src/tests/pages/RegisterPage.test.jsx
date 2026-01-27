import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import RegisterPage from '../../pages/RegisterPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('../../assets/logo.png', () => ({
  default: 'logo-mock',
}));

// Mockeamos las validaciones para tener control total en el test
vi.mock('../../utils/validations', () => ({
  formatRut: (val) => val, 
  isValidEmail: (email) => email === 'test@mail.com', // Solo este email pasará
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renderiza el formulario de registro correctamente', () => {
    render(<RegisterPage />);

    expect(screen.getByPlaceholderText(/12\.345\.678-9/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/juan ignacio/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument();
  });

  it('muestra error y no envía datos si el email es inválido', async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/12\.345\.678-9/i), { target: { value: '12345678-9' } });
    fireEvent.change(screen.getByPlaceholderText(/juan ignacio/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/pérez soto/i), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: '123456' } });
    
    // Probamos con un email que nuestro mock rechazará
    const emailInput = screen.getByPlaceholderText(/correo@ejemplo.com/i);
    fireEvent.change(emailInput, { target: { value: 'malo@prueba.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear Cuenta/i }));

    expect(await screen.findByText(/El correo electrónico no es válido/i)).toBeInTheDocument();
    
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('envía el formulario y redirige si todo es correcto', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        user: { id: '123' },
        session: { access_token: 'fake-token' }
      }
    });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/12\.345\.678-9/i), { target: { value: '12.345.678-9' } });
    fireEvent.change(screen.getByPlaceholderText(/juan ignacio/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText(/pérez soto/i), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: '123456' } });
    
    // Usamos el email válido definido en el mock
    fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), { target: { value: 'test@mail.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Crear Cuenta/i }));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/ficha-medica');
  });
});