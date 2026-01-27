// Renderiza el panel del especialista
// Muestra pacientes desde el servicio
// Filtra pacientes por estado
// Navega a la ficha del paciente

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SpecialistDashboard from '../../pages/SpecialistDashboard'
import * as SpecialistService from '../../services/SpecialistService'

// mock navigate
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// mock servicios
vi.spyOn(SpecialistService, 'getPatients')
vi.spyOn(SpecialistService, 'getPatientDashboardData')

describe('SpecialistDashboard', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockPatients = [
    {
      id: 1,
      first_names: 'Juan',
      last_names: 'Pérez',
      rut: '11.111.111-1',
    },
    {
      id: 2,
      first_names: 'Ana',
      last_names: 'Gómez',
      rut: '22.222.222-2',
    },
  ]

  it('renderiza el panel del especialista', async () => {
    SpecialistService.getPatients.mockResolvedValue([])
    
    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/panel de control medico/i)
    ).toBeInTheDocument()
  })

  it('muestra pacientes cargados desde el servicio', async () => {
    SpecialistService.getPatients.mockResolvedValue(mockPatients)

    SpecialistService.getPatientDashboardData.mockResolvedValue({
      glucose: { value: 100, date: '2024-01-01' },
      pressure: { systolic: 120, diastolic: 80, date: '2024-01-01' },
    })

    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument()
      expect(screen.getByText(/ana gómez/i)).toBeInTheDocument()
    })
  })

  it('filtra pacientes en estado crítico', async () => {
    SpecialistService.getPatients.mockResolvedValue(mockPatients)

    SpecialistService.getPatientDashboardData
      .mockResolvedValueOnce({
        glucose: { value: 180, date: '2024-01-01' },
        pressure: { systolic: 150, diastolic: 95, date: '2024-01-01' },
      })
      .mockResolvedValueOnce({
        glucose: { value: 95, date: '2024-01-01' },
        pressure: { systolic: 120, diastolic: 80, date: '2024-01-01' },
      })

    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument()
      expect(screen.getByText(/ana gómez/i)).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: /alertas/i })
    )

    expect(screen.getByText(/juan pérez/i)).toBeInTheDocument()
    expect(screen.queryByText(/ana gómez/i)).not.toBeInTheDocument()
  })

  it('navega a la ficha del paciente al hacer click', async () => {
    SpecialistService.getPatients.mockResolvedValue([mockPatients[0]])

    SpecialistService.getPatientDashboardData.mockResolvedValue({
      glucose: { value: 100, date: '2024-01-01' },
      pressure: { systolic: 120, diastolic: 80, date: '2024-01-01' },
    })

    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/juan pérez/i)).toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: /ver ficha/i })
    )

    expect(mockNavigate).toHaveBeenCalledWith('/paciente/1')
  })
})
