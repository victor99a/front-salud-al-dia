import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminPage from '../../pages/AdminPage'

// Mockeamos los componentes hijos para probar solo la estructura de la página
// y no la lógica interna de las tablas o estadísticas.
vi.mock('../../components/Admin/AdminStats', () => ({
  default: () => <div>AdminStats Mock</div>,
}))

vi.mock('../../components/Admin/UserTable', () => ({
  default: () => <div>UserTable Mock</div>,
}))

vi.mock('../../components/Admin/RegisterSpecialistModal', () => ({
  default: ({ onClose }) => (
    <div>
      <p>RegisterSpecialistModal Mock</p>
      <button onClick={onClose}>Cerrar Modal</button>
    </div>
  ),
}))

vi.mock('lucide-react', () => ({
  UserPlus: () => <span>Icon</span>,
}))

describe('AdminPage', () => {
  it('renderiza el título y la sección de usuarios', () => {
    render(<AdminPage />)

    expect(
      screen.getByText(/Panel de Control/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Lista de Usuarios/i)
    ).toBeInTheDocument()
  })

  it('muestra el modal al hacer click en "Nuevo Especialista"', () => {
    render(<AdminPage />)

    const button = screen.getByRole('button', {
      name: /Nuevo Especialista/i,
    })

    fireEvent.click(button)

    expect(
      screen.getByText(/RegisterSpecialistModal Mock/i)
    ).toBeInTheDocument()
  })
})