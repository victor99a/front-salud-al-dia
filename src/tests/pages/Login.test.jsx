// Renderiza el formulario de inicio de sesión
// Muestra el modal de recuperación de contraseña al hacer clic

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Login from '../../pages/LoginPage'

// Mock navegación
const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children }) => <span>{children}</span>,
}))

// Mock servicios
vi.mock('../../services/AuthService', () => ({
  requestPublicPasswordReset: vi.fn(),
  getUserProfile: vi.fn(),
}))

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

// Mock logo
vi.mock('../../assets/logo.png', () => ({
  default: 'logo-mock',
}))

describe('Login', () => {
  it('renderiza el formulario de login', () => {
    render(<Login />)

    // Inputs por placeholder (forma correcta en tu caso)
    expect(
      screen.getByPlaceholderText(/ejemplo@correo.com/i)
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/••••••••/i)
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /Entrar al Panel/i })
    ).toBeInTheDocument()
  })

  it('muestra el modal de recuperación al hacer clic en "¿Olvidaste tu contraseña?"', () => {
    render(<Login />)

    fireEvent.click(
      screen.getByRole('button', { name: /¿Olvidaste tu contraseña\?/i })
    )

    expect(
      screen.getByText(/Recuperar Contraseña/i)
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/tu@correo.com/i)
    ).toBeInTheDocument()
  })
})
