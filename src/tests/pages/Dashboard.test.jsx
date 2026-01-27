import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Dashboard from '../../pages/Dashboard'

// Mock useNavigate
const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock de componentes hijos
vi.mock('../../components/Dashboard/GlucoseCard', () => ({
  default: () => <div>GlucoseCard Mock</div>,
}))

vi.mock('../../components/Dashboard/PressureCard', () => ({
  default: () => <div>PressureCard Mock</div>,
}))

// Mock de iconos
vi.mock('react-icons/fa', () => ({
  FaPlusCircle: () => <span>PlusIcon</span>,
  FaChartBar: () => <span>ChartIcon</span>,
}))

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.setItem('user_id', '123')
  })

  it('renderiza el título y las tarjetas principales', () => {
    render(<Dashboard />)

    expect(
      screen.getByText(/Panel de Control/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/GlucoseCard Mock/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/PressureCard Mock/i)
    ).toBeInTheDocument()
  })

  it('navega a registro e historial al hacer click en las tarjetas', () => {
    render(<Dashboard />)

    fireEvent.click(
      screen.getByText(/Registrar Información/i)
    )

    expect(mockNavigate).toHaveBeenCalledWith('/registro-salud')

    fireEvent.click(
      screen.getByText(/Ver Historial/i)
    )

    expect(mockNavigate).toHaveBeenCalledWith('/historial')
  })
})
