import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import RegisterPage from '../../pages/RegisterPage'

// mock navegación
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

// mock logo
vi.mock('../../assets/logo.png', () => ({
  default: 'logo-mock',
}))

describe('RegisterPage', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el formulario de registro', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    )

    expect(screen.getByPlaceholderText(/12\.345\.678-9/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/juan ignacio/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/pérez soto/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/correo@ejemplo.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('no permite enviar el formulario si el email es inválido', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    )

    fireEvent.change(
      screen.getByPlaceholderText(/12\.345\.678-9/i),
      { target: { value: '12.345.678-9' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText(/juan ignacio/i),
      { target: { value: 'Juan' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText(/pérez soto/i),
      { target: { value: 'Perez' } }
    )

    const emailInput = screen.getByPlaceholderText(/correo@ejemplo.com/i)

    fireEvent.change(emailInput, {
      target: { value: 'correo-malo' }
    })

    fireEvent.change(
      screen.getByPlaceholderText(/••••••••/i),
      { target: { value: '12345678' } }
    )

    fireEvent.click(
      screen.getByRole('button', { name: /crear cuenta/i })
    )

    //  validación HTML5
    expect(emailInput.checkValidity()).toBe(false)

    //  no debe navegar
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
