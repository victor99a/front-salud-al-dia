import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../../pages/ProfilePage';
import { getMedicalRecord, updateMedicalRecord } from '../../services/MedicalService';
import { requestAccountDeletion } from '../../services/AdminService';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children }) => <a href="#">{children}</a>,
}));

vi.mock('../../services/MedicalService', () => ({
  getMedicalRecord: vi.fn(),
  updateMedicalRecord: vi.fn(),
}));

vi.mock('../../services/AdminService', () => ({
  requestAccountDeletion: vi.fn(),
}));

vi.mock('lucide-react', () => ({
  User: () => <span>Icon</span>,
  Ruler: () => <span>Icon</span>,
  AlertTriangle: () => <span>Icon</span>,
  Phone: () => <span>Icon</span>,
  AlertCircle: () => <span>Icon</span>,
  Save: () => <span>Icon</span>,
  X: () => <span>Icon</span>,
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('muestra el mensaje de carga inicialmente', () => {
    getMedicalRecord.mockReturnValue(new Promise(() => {}));
    
    render(<ProfilePage />);
    expect(screen.getByText(/Cargando perfil.../i)).toBeInTheDocument();
  });

  it('muestra mensaje cuando no existe ficha médica', async () => {
    localStorage.setItem('user_id', '123');
    localStorage.setItem('user_name', 'Juan Pérez');
    getMedicalRecord.mockResolvedValueOnce(null);

    render(<ProfilePage />);

    expect(await screen.findByText(/Ficha médica no encontrada/i)).toBeInTheDocument();
    expect(screen.getByText(/Crear Ficha Médica/i)).toBeInTheDocument();
  });

  it('renderiza la información del perfil médico', async () => {
    localStorage.setItem('user_id', '123');
    localStorage.setItem('user_name', 'Juan Pérez');
    
    getMedicalRecord.mockResolvedValueOnce({
      height: 170,
      initial_weight: 75,
      blood_type: 'O+',
      allergies: 'Ninguna',
      chronic_diseases: 'Ninguna',
      emergency_contact_name: 'María',
      emergency_contact_phone: '+56912345678',
    });

    render(<ProfilePage />);

    expect(await screen.findByText(/Juan Pérez/i)).toBeInTheDocument();
    expect(screen.getByText(/Datos Corporales/i)).toBeInTheDocument();
    expect(screen.getByText('170 cm')).toBeInTheDocument();
    expect(screen.getByText('María')).toBeInTheDocument();
  });

  it('entra en modo edición y muestra inputs', async () => {
    localStorage.setItem('user_id', '123');
    getMedicalRecord.mockResolvedValueOnce({ height: 170, initial_weight: 75 });

    render(<ProfilePage />);
    
    await waitFor(() => expect(screen.getByText('170 cm')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Editar'));

    const saveButton = await screen.findByText(/Guardar Cambios/i);
    expect(saveButton).toBeInTheDocument();

    const numberInputs = screen.getAllByRole('spinbutton');
    expect(numberInputs.length).toBeGreaterThanOrEqual(1); 
    
    expect(numberInputs[0]).toHaveValue(170); 
  });

  it('abre el modal de eliminación de cuenta', async () => {
    localStorage.setItem('user_id', '123');
    getMedicalRecord.mockResolvedValueOnce({}); 

    render(<ProfilePage />);
    await waitFor(() => screen.getByText(/Información Médica/i));

    fireEvent.click(screen.getByText(/Solicitar Eliminación/i));

    expect(screen.getByText(/¿Confirmar solicitud?/i)).toBeInTheDocument();
  });
});