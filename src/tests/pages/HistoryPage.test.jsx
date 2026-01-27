import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HistoryPage from '../../pages/HistoryPage';
import axios from 'axios';
import { descargarHistorial } from '../../services/downloadService';

vi.mock('axios');
vi.mock('../../services/downloadService', () => ({
  descargarHistorial: vi.fn(),
}));

vi.mock('../../utils/formatDate', () => ({
  formatDateLong: () => '01 de Enero 2024',
}));

describe('HistoryPage', () => {
  beforeEach(() => {
    localStorage.setItem('user_id', '123');
    vi.clearAllMocks(); 
  });

  it('renderiza el título y mensaje cuando no hay registros', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<HistoryPage />);

    expect(screen.getByText(/Historial de Mediciones/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/No hay registros disponibles/i)).toBeInTheDocument();
    });
  });

  it('renderiza registros cuando la API devuelve datos', async () => {
    const mockData = [
      { date: '2024-01-01', glucose: 100, systolic: 120, diastolic: 80 }
    ];
    axios.get.mockResolvedValueOnce({ data: mockData });

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText(/Glucosa: 100 mg\/dL/i)).toBeInTheDocument();
    });
  });

  it('llama a descargarHistorial al hacer click en los botones', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<HistoryPage />);

    fireEvent.click(screen.getByRole('button', { name: /Descargar PDF/i }));
    expect(descargarHistorial).toHaveBeenCalledWith('123', 'pdf');

    fireEvent.click(screen.getByRole('button', { name: /Descargar CSV/i }));
    expect(descargarHistorial).toHaveBeenCalledWith('123', 'csv');
  });
});