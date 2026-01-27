import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserRow from '../../../components/Admin/UserRow';
import * as AdminService from '../../../services/AdminService';

vi.mock('../../../services/AdminService');

describe('UserRow.jsx', () => {
  const mockUser = {
    id: 1,
    rut: '12.345.678-9',
    first_names: 'Juan',
    last_names: 'Pérez',
    email: 'juan@test.com',
    role: 'patient',
    status: 'active'
  };

  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockImplementation(() => true); 
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe renderizar los datos del usuario correctamente', () => {
    render(
      <table>
        <tbody>
          <UserRow user={mockUser} onUpdate={mockOnUpdate} />
        </tbody>
      </table>
    );

    expect(screen.getByText('12.345.678-9')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Paciente')).toBeInTheDocument();
  });

  it('debe intentar eliminar usuario al hacer clic en borrar y confirmar', async () => {
    AdminService.deleteUser.mockResolvedValue({ success: true });

    render(
      <table>
        <tbody>
          <UserRow user={mockUser} onUpdate={mockOnUpdate} />
        </tbody>
      </table>
    );

    const deleteBtn = screen.getByTitle('Eliminar permanentemente');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    
    await waitFor(() => {
        expect(AdminService.deleteUser).toHaveBeenCalledWith(1);
        expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('debe mostrar alerta de borrado solicitado si el status es delete_requested', () => {
    const deletingUser = { ...mockUser, status: 'delete_requested', delete_requested_at: '2023-01-01' };

    render(
      <table>
        <tbody>
          <UserRow user={deletingUser} onUpdate={mockOnUpdate} />
        </tbody>
      </table>
    );

    expect(screen.getByText(/Solicitó borrar/i)).toBeInTheDocument();
    expect(screen.getByText('Por Borrar')).toBeInTheDocument();
  });
});