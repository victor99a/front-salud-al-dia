import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ResetPassword from '../../pages/ResetPassword'
import * as AdminService from '../../services/AdminService'

// mock navigate
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// mock servicio
vi.spyOn(AdminService, 'updatePasswordFinal')

describe('ResetPassword Page', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithEmail = () => {
    render(
      <MemoryRouter initialEntries={['/reset?email=test@mail.com']}>
        <Routes>
          <Route path="/reset" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('renderiza el formulario con el email', () => {
    renderWithEmail()

    expect(
      screen.getByText(/restablecer contraseña/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/cuenta: test@mail.com/i)
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/mínimo 6 caracteres/i)
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/repite la contraseña/i)
    ).toBeInTheDocument()
  })

  it('no envía si las contraseñas no coinciden', () => {
    renderWithEmail()

    fireEvent.change(
      screen.getByPlaceholderText(/mínimo 6 caracteres/i),
      { target: { value: '123456' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText(/repite la contraseña/i),
      { target: { value: '654321' } }
    )

    fireEvent.click(
      screen.getByRole('button', { name: /cambiar contraseña/i })
    )

    expect(AdminService.updatePasswordFinal).not.toHaveBeenCalled()
  })

  it('muestra mensaje de éxito cuando la contraseña se actualiza', async () => {
    AdminService.updatePasswordFinal.mockResolvedValue({
      success: true,
    })

    renderWithEmail()

    fireEvent.change(
      screen.getByPlaceholderText(/mínimo 6 caracteres/i),
      { target: { value: '123456' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText(/repite la contraseña/i),
      { target: { value: '123456' } }
    )

    fireEvent.click(
      screen.getByRole('button', { name: /cambiar contraseña/i })
    )

    await waitFor(() => {
      expect(
        screen.getByText(/contraseña actualizada/i)
      ).toBeInTheDocument()
    })
  })
})
