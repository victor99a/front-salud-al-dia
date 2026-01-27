import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SpecialistDashboard from '../../pages/SpecialistDashboard';
import { getPatients, getPatientDashboardData } from '../../services/SpecialistService';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../services/SpecialistService', () => ({
  getPatients: vi.fn(),
  getPatientDashboardData: vi.fn(),
}));

vi.mock('lucide-react', () => ({
  Search: () => <span data-testid="search-icon">Search</span>,
  FileText: () => <span>File</span>,
  User: () => <span>User</span>,
}));

describe('SpecialistDashboard', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPatients = [
    { id: 1, first_names: 'Juan', last_names: 'Pérez', rut: '11.111.111-1' },
    { id: 2, first_names: 'Ana', last_names: 'Gómez', rut: '22.222.222-2' },
  ];

  it('renderiza el panel y muestra el título', async () => {
    getPatients.mockResolvedValue([]);
    
    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Panel de Control Medico/i)).toBeInTheDocument();
    expect(screen.getByText(/Monitoreo de pacientes/i)).toBeInTheDocument();
  });

  it('carga y muestra la lista de pacientes', async () => {
    getPatients.mockResolvedValue(mockPatients);
    
    getPatientDashboardData.mockResolvedValue({
      glucose: { value: 100, date: '2024-01-01' },
      pressure: { systolic: 120, diastolic: 80, date: '2024-01-01' },
    });

    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument();
      expect(screen.getByText(/Ana Gómez/i)).toBeInTheDocument();
    });
  });

  it('filtra pacientes en estado crítico (Alertas)', async () => {
    getPatients.mockResolvedValue(mockPatients);

    getPatientDashboardData.mockImplementation(async (id) => {
      if (id === 1) {
        return { 
            glucose: { value: 180, date: '2024-01-01' }, // Crítico
            pressure: { systolic: 150, diastolic: 95 } 
        };
      }
      return { 
          glucose: { value: 90, date: '2024-01-01' }, // Estable
          pressure: { systolic: 120, diastolic: 80 } 
      };
    });

    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Alertas/i }));

    expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument();
    expect(screen.queryByText(/Ana Gómez/i)).not.toBeInTheDocument();
  });

  it('filtra pacientes por nombre en el buscador', async () => {
    getPatients.mockResolvedValue(mockPatients);
    getPatientDashboardData.mockResolvedValue({ glucose: {}, pressure: {} });

    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Buscar paciente/i);
    fireEvent.change(searchInput, { target: { value: 'Ana' } });

    expect(screen.getByText(/Ana Gómez/i)).toBeInTheDocument();
    expect(screen.queryByText(/Juan Pérez/i)).not.toBeInTheDocument();
  });

  it('navega a la ficha del paciente al hacer click en "Ver Ficha"', async () => {
    getPatients.mockResolvedValue([mockPatients[0]]); // Solo Juan
    getPatientDashboardData.mockResolvedValue({});

    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Ver Ficha/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/paciente/1');
  });
});