import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPassword from '../../pages/ResetPassword';
import * as AdminService from '../../services/AdminService';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.spyOn(AdminService, 'updatePasswordFinal');

describe('ResetPassword Page', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  const renderWithEmail = () => {
    render(
      <MemoryRouter initialEntries={['/reset?email=test@mail.com']}>
        <Routes>
          <Route path="/reset" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renderiza el formulario con el email obtenido de la URL', () => {
    renderWithEmail();

    expect(screen.getByText(/Restablecer Contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/cuenta: test@mail.com/i)).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText(/Mínimo 6 caracteres/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Repite la contraseña/i)).toBeInTheDocument();
  });

  it('redirige al login si no hay email en la URL', () => {
    render(
      <MemoryRouter initialEntries={['/reset']}>
         <Routes>
          <Route path="/reset" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('no envía datos si las contraseñas no coinciden', () => {
    renderWithEmail();

    fireEvent.change(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText(/Repite la contraseña/i), { target: { value: '654321' } });

    fireEvent.click(screen.getByRole('button', { name: /Cambiar Contraseña/i }));

    expect(AdminService.updatePasswordFinal).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Las contraseñas no coinciden");
  });

  it('muestra mensaje de éxito y redirige cuando la contraseña se actualiza', async () => {
    AdminService.updatePasswordFinal.mockResolvedValue({ success: true });

    renderWithEmail();

    fireEvent.change(screen.getByPlaceholderText(/Mínimo 6 caracteres/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText(/Repite la contraseña/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /Cambiar Contraseña/i }));

    await waitFor(() => {
      expect(screen.getByText(/Contraseña Actualizada/i)).toBeInTheDocument();
    });

    expect(AdminService.updatePasswordFinal).toHaveBeenCalledWith('test@mail.com', '123456');
  });
});