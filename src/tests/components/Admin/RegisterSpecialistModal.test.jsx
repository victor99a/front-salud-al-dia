import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterSpecialistModal from '../../../components/Admin/RegisterSpecialistModal';
import * as AdminService from '../../../services/AdminService';

vi.mock('../../../services/AdminService');

describe('RegisterSpecialistModal.jsx', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('debe renderizar el formulario correctamente', () => {
    render(<RegisterSpecialistModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.getByText(/Registrar Especialista/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/12.345.678-K/i)).toBeInTheDocument();
  });

  it('debe mostrar errores de validación si se envía vacío', () => {
    render(<RegisterSpecialistModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const submitBtn = screen.getByText('Registrar Profesional');
    fireEvent.click(submitBtn);

    expect(screen.getByText(/RUT es incompleto/i)).toBeInTheDocument();
    expect(screen.getByText(/Formato de correo inválido/i)).toBeInTheDocument();
  });

  it('debe formatear el RUT automáticamente mientras se escribe', () => {
    render(<RegisterSpecialistModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    
    const rutInput = screen.getByPlaceholderText(/12.345.678-K/i);
    fireEvent.change(rutInput, { target: { value: '123456789' } });

    expect(rutInput.value).toBe('12.345.678-9');
  });

  it('debe llamar a createSpecialist y cerrar el modal en éxito', async () => {
    AdminService.createSpecialist.mockResolvedValue({ success: true });

    const { container } = render(<RegisterSpecialistModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const inputNames = container.querySelector('input[name="first_names"]');
    const inputLastNames = container.querySelector('input[name="last_names"]');
    const inputRut = container.querySelector('input[name="rut"]');
    const inputEmail = container.querySelector('input[name="email"]');
    const inputPassword = container.querySelector('input[name="password"]');

    fireEvent.change(inputNames, { target: { value: 'Dr' } });
    fireEvent.change(inputLastNames, { target: { value: 'House' } });
    fireEvent.change(inputRut, { target: { value: '111111111' } });
    fireEvent.change(inputEmail, { target: { value: 'house@hospital.com' } });
    fireEvent.change(inputPassword, { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByText('Registrar Profesional'));

    await waitFor(() => {
      expect(AdminService.createSpecialist).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});