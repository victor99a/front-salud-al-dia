// renderiza el titulo y la seccion usuarios//
// muestra el modal al hacer click en nuevo especialista//

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminPage from '../../pages/AdminPage'

// Mocks de componentes hijos
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

// Mock del icono
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
