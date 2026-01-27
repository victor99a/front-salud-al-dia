import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserTable from '../../../components/Admin/UserTable';
import * as AdminService from '../../../services/AdminService';

vi.mock('../../../services/AdminService');

// Aquí hacemos un "mock" del componente UserRow.
// Lo hacemos simple (solo muestra nombre y email) para que en este test
// nos enfoquemos solo en la lógica de la Tabla (filtros, carga, etc)
// y no en los botones o lógica interna de cada fila.
vi.mock('../../../components/Admin/UserRow', () => ({
  default: ({ user }) => (
    <tr data-testid="user-row">
      <td>{user.first_names}</td>
      <td>{user.email}</td>
    </tr>
  )
}));

describe('UserTable.jsx', () => {
  const mockUsers = [
    { id: 1, first_names: 'Ana', role: 'admin', status: 'active' },
    { id: 2, first_names: 'Beto', role: 'patient', status: 'active' },
    { id: 3, first_names: 'Carla', role: 'patient', status: 'delete_requested' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar mensaje de carga y luego la lista de usuarios', async () => {
    // Simulamos que el servicio responde bien con los datos de prueba
    AdminService.getUsers.mockResolvedValue(mockUsers);

    render(<UserTable />);

    expect(screen.getByText(/Cargando usuarios/i)).toBeInTheDocument();

    // Esperamos a que el componente termine de cargar y muestre las 3 filas
    await waitFor(() => {
      const rows = screen.getAllByTestId('user-row');
      expect(rows).toHaveLength(3);
    });
  });

  it('debe filtrar usuarios por búsqueda', async () => {
    AdminService.getUsers.mockResolvedValue(mockUsers);
    render(<UserTable />);

    await waitFor(() => screen.getAllByTestId('user-row'));

    // Escribimos "Ana" en el input del buscador
    const searchInput = screen.getByPlaceholderText(/Buscar por nombre/i);
    fireEvent.change(searchInput, { target: { value: 'Ana' } });

    // Verificamos que solo quede 1 fila visible (la de Ana)
    expect(screen.getAllByTestId('user-row')).toHaveLength(1);
    expect(screen.getByText('Ana')).toBeInTheDocument();
    
    // Y nos aseguramos que "Beto" haya desaparecido de la pantalla
    expect(screen.queryByText('Beto')).not.toBeInTheDocument();
  });

  it('debe filtrar solo solicitudes de borrado al hacer clic en el botón de alerta', async () => {
    AdminService.getUsers.mockResolvedValue(mockUsers);
    render(<UserTable />);

    await waitFor(() => screen.getAllByTestId('user-row'));

    // Hacemos clic en el botón para ver solo los que pidieron borrado
    const filterBtn = screen.getByText(/Ver Solicitudes de Borrado/i);
    fireEvent.click(filterBtn);

    const rows = screen.getAllByTestId('user-row');
    // Solo Carla tiene el estado 'delete_requested', así que debería quedar sola ella
    expect(rows).toHaveLength(1); 
    expect(screen.getByText('Carla')).toBeInTheDocument();
  });
});