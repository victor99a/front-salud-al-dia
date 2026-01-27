import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AdminStats from '../../../components/Admin/AdminStats';
import * as AdminService from '../../../services/AdminService';

vi.mock('../../../services/AdminService');

describe('AdminStats.jsx', () => {
  const mockStats = {
    total: 100,
    active: 50,
    roles: [
      { role: 'admin', count: 5 },
      { role: 'specialist', count: 15 },
      { role: 'patient', count: 80 }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar con valores en 0 inicialmente', () => {
    AdminService.getStats.mockResolvedValue({});
    render(<AdminStats />);

    expect(screen.getByText('Total Usuarios')).toBeInTheDocument();
    
    const values = screen.getAllByText('0');
    expect(values.length).toBeGreaterThan(0);
  });

  it('debe cargar y mostrar las estadísticas correctamente', async () => {
    AdminService.getStats.mockResolvedValue(mockStats);

    render(<AdminStats />);

    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
    });
  });
});