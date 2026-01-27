import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../components/Dashboard/GlucoseCard', () => ({
  default: () => <div data-testid="glucose-card">GlucoseCard Mock</div>,
}));

vi.mock('../../components/Dashboard/PressureCard', () => ({
  default: () => <div data-testid="pressure-card">PressureCard Mock</div>,
}));

vi.mock('react-icons/fa', () => ({
  FaPlusCircle: () => <span>PlusIcon</span>,
  FaChartBar: () => <span>ChartIcon</span>,
}));

describe('Dashboard', () => {

  const fetchMock = vi.fn();
  global.fetch = fetchMock;

  beforeEach(() => {
    localStorage.setItem('user_id', '123');
    vi.clearAllMocks(); 
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renderiza el título y hace la petición de datos inicial', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        glucose: { value: 100, date: '2024-01-01' },
        pressure: { systolic: 120, diastolic: 80 },
      }),
    });

    render(<Dashboard />);

    expect(screen.getByText(/Panel de Control/i)).toBeInTheDocument();
    expect(screen.getByTestId('glucose-card')).toBeInTheDocument();
    expect(screen.getByTestId('pressure-card')).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/api/registros/dashboard/123')
      );
    });
  });

  it('navega a registro e historial al hacer click en las tarjetas', () => {
    fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
    });

    render(<Dashboard />);

    fireEvent.click(screen.getByText(/Registrar Información/i));
    expect(mockNavigate).toHaveBeenCalledWith('/registro-salud');

    fireEvent.click(screen.getByText(/Ver Historial/i));
    expect(mockNavigate).toHaveBeenCalledWith('/historial');
  });
});