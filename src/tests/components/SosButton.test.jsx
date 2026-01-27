import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SosButton from '../../components/SosButton';

vi.mock('axios');

describe('SosButton.jsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('user_id', '123');
    localStorage.setItem('token', 'token-123');
    
    // Mock para el portapapeles y window.open
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
    vi.spyOn(window, 'open').mockImplementation(() => {});
    
    // Espiamos el console.warn para verificar avisos
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('debe lanzar un warning en consola si no hay usuario logueado', () => {
    localStorage.removeItem('user_id'); 
    render(<SosButton />);
    
    fireEvent.click(screen.getByLabelText('Emergencia SOS'));
    
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Usuario no autenticado'));
  });

  it('debe llamar a la API y abrir modal con teléfono si hay éxito', async () => {
    axios.get.mockResolvedValue({
      data: { success: true, phone: '+56912345678' }
    });

    render(<SosButton />);
    
    const btn = screen.getByLabelText('Emergencia SOS');
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Ayuda de Emergencia')).toBeInTheDocument();
      expect(screen.getByText('+56912345678')).toBeInTheDocument();
    });
  });

  it('debe copiar el número al portapapeles', async () => {
    axios.get.mockResolvedValue({
      data: { success: true, phone: '+56912345678' }
    });

    render(<SosButton />);
    fireEvent.click(screen.getByLabelText('Emergencia SOS'));

    await waitFor(() => screen.getByText('+56912345678'));

    fireEvent.click(screen.getByTitle('Haz clic para copiar'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('+56912345678');
    expect(screen.getByText('Copiado')).toBeInTheDocument();
  });

  it('debe intentar abrir WhatsApp con el número correcto', async () => {
    axios.get.mockResolvedValue({
      data: { success: true, phone: '+56912345678' }
    });

    render(<SosButton />);
    fireEvent.click(screen.getByLabelText('Emergencia SOS'));
    await waitFor(() => screen.getByText('Enviar WhatsApp'));

    fireEvent.click(screen.getByText('Enviar WhatsApp'));
    
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/56912345678'), 
      '_blank'
    );
  });
});