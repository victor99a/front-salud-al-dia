import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ChatWidget from '../../../components/Chat/ChatWidget';

vi.mock('axios');

describe('ChatWidget.jsx', () => {
  const userId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
    // Los tests corren en una terminal, no en un navegador real.
    // La terminal no tiene barra de desplazamiento (scroll), así que "fingimos" esta función
    // para que el chat no se rompa cuando intente bajar automáticamente al último mensaje.
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('no debe renderizar nada si no hay userId', () => {
    const { container } = render(<ChatWidget userId={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('debe estar cerrado inicialmente y abrirse al hacer click', () => {
    render(<ChatWidget userId={userId} />);
    
    const toggleBtn = screen.getByLabelText('Abrir Asistente Médico Virtual');
    expect(toggleBtn).toBeInTheDocument();
    
    fireEvent.click(toggleBtn);
    
    expect(screen.getByText('Dr. Chapatín')).toBeInTheDocument();
    expect(screen.getByText(/Hola. Soy el Dr. Chapatín/i)).toBeInTheDocument();
  });

  it('debe enviar un mensaje y mostrar la respuesta del bot', async () => {
    // Simulamos que el "backend" nos responde bien
    axios.post.mockResolvedValue({ data: { response: 'Tómese un paracetamol.' } });

    render(<ChatWidget userId={userId} />);
    
    fireEvent.click(screen.getByLabelText('Abrir Asistente Médico Virtual'));

    const input = screen.getByPlaceholderText('Describe tus síntomas...');
    fireEvent.change(input, { target: { value: 'Me duele la cabeza' } });

    // Buscamos el formulario más cercano al input y lo enviamos.
    // Es más seguro que buscar el botón porque simula el "Enter" del teclado también.
    fireEvent.submit(input.closest('form')); 

    // Verificamos que MI mensaje apareció
    expect(screen.getByText('Me duele la cabeza')).toBeInTheDocument();

    // Verificamos que salió el loader de carga
    expect(screen.getByText(/Analizando.../i)).toBeInTheDocument();

    // Usamos waitFor porque la respuesta de la IA no llega al tiro.
    // Le decimos al test: "Espera un cachito hasta que aparezca este texto".
    await waitFor(() => {
      expect(screen.getByText('Tómese un paracetamol.')).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/ai/send'),
      { userId, message: 'Me duele la cabeza' },
      expect.anything()
    );
  });

  it('debe manejar errores de la API', async () => {
    // Simulamos que el backend se cayó o dio error
    axios.post.mockRejectedValue(new Error('Error de red'));

    render(<ChatWidget userId={userId} />);
    fireEvent.click(screen.getByLabelText('Abrir Asistente Médico Virtual'));

    const input = screen.getByPlaceholderText('Describe tus síntomas...');
    fireEvent.change(input, { target: { value: 'Hola' } });
    fireEvent.submit(input.closest('form'));

    // Esperamos a que el chat se de cuenta del error y muestre el mensaje de fallo
    await waitFor(() => {
      expect(screen.getByText(/tengo dificultades técnicas/i)).toBeInTheDocument();
    });
  });
});