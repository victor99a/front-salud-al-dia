import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MedicalRecords from '../../pages/MedicalRecords'

// Mock navegación
const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock servicio
vi.mock('../../services/MedicalService', () => ({
  createMedicalRecord: vi.fn(),
}))

// Mock logo
vi.mock('../../assets/logo.png', () => ({
  default: 'logo-mock',
}))

describe('MedicalRecords', () => {

  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
  })

  // TEST 1 — Renderiza formulario
  it('renderiza el formulario de ficha médica', () => {
    localStorage.setItem('user_id', '123')
    localStorage.setItem('token', 'token-test')

    render(<MedicalRecords />)

    expect(
      screen.getByText(/Ficha Médica Inicial/i)
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/Ej: 170/i)
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(/Ej: 75/i)
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /Finalizar y Entrar/i })
    ).toBeInTheDocument()
  })

  //  TEST 2 — Redirige si no hay sesión
  it('redirige a login si no existe sesión', () => {
    render(<MedicalRecords />)

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  //  TEST 3 — Botón deshabilitado si el formulario es inválido
  it('deshabilita el botón si el formulario no es válido', () => {
    localStorage.setItem('user_id', '123')
    localStorage.setItem('token', 'token-test')

    render(<MedicalRecords />)

    const submitButton = screen.getByRole('button', {
      name: /Finalizar y Entrar/i,
    })

    expect(submitButton).toBeDisabled()
  })
})
