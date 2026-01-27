import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MedicalRecords from '../../pages/MedicalRecords';
import { createMedicalRecord } from '../../services/MedicalService';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../services/MedicalService', () => ({
  createMedicalRecord: vi.fn(),
}));

vi.mock('../../assets/logo.png', () => ({
  default: 'logo-mock',
}));

describe('MedicalRecords', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Silenciamos el alert para que no falle el test al simular errores
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renderiza el formulario de ficha médica', () => {
    localStorage.setItem('user_id', '123');
    localStorage.setItem('token', 'token-test');

    render(<MedicalRecords />);

    expect(screen.getByText(/Ficha Médica Inicial/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej: 170/i)).toBeInTheDocument();
    expect(screen.getByText(/Autorizo el tratamiento de mis datos/i)).toBeInTheDocument();
  });

  it('redirige a login si no existe sesión', () => {
    render(<MedicalRecords />);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('deshabilita el botón si el formulario está incompleto', () => {
    localStorage.setItem('user_id', '123');
    localStorage.setItem('token', 'token-test');

    render(<MedicalRecords />);

    const submitButton = screen.getByRole('button', { name: /Finalizar y Entrar/i });
    expect(submitButton).toBeDisabled();
  });

  it('habilita el botón y envía datos correctamente formateados', async () => {
    localStorage.setItem('user_id', '123');
    localStorage.setItem('token', 'token-test');
    
    createMedicalRecord.mockResolvedValueOnce({});

    render(<MedicalRecords />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'O+' } });
    fireEvent.change(screen.getByPlaceholderText(/Ej: 170/i), { target: { value: '175' } });
    fireEvent.change(screen.getByPlaceholderText(/Ej: 75/i), { target: { value: '80' } });
    fireEvent.change(screen.getByPlaceholderText(/Nombre completo/i), { target: { value: 'Mamá' } });
    
    // El teléfono debe empezar con 9 para pasar la validación interna
    const phoneInput = screen.getByPlaceholderText(/9 1234 5678/i);
    fireEvent.change(phoneInput, { target: { value: '987654321' } });

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const submitButton = screen.getByRole('button', { name: /Finalizar y Entrar/i });
    expect(submitButton).toBeEnabled();

    fireEvent.click(submitButton);

    await waitFor(() => {
        // Verificamos que se agregue el prefijo +56 automáticamente antes de enviar
        expect(createMedicalRecord).toHaveBeenCalledWith(expect.objectContaining({
            blood_type: 'O+',
            height: '175',
            initial_weight: '80',
            emergency_contact_name: 'Mamá',
            emergency_contact_phone: '+56987654321', 
            user_id: '123'
        }));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});