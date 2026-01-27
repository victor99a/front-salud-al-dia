import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProfilePage from '../../pages/ProfilePage'

// ─── Mock navegación ─────────────────────────────
const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children }) => <span>{children}</span>,
}))

// ─── Mock servicios médicos ──────────────────────
vi.mock('../../services/MedicalService', () => ({
  getMedicalRecord: vi.fn(),
  updateMedicalRecord: vi.fn(),
}))

// ─── Mock servicio admin ─────────────────────────
vi.mock('../../services/AdminService', () => ({
  requestAccountDeletion: vi.fn(() =>
    Promise.resolve({ success: true })
  ),
}))

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  //  TEST 1 — Muestra loading al iniciar
  it('muestra el mensaje de carga inicialmente', () => {
    render(<ProfilePage />)

    expect(
      screen.getByText(/Cargando/i)
    ).toBeInTheDocument()
  })

  //  TEST 2 — Muestra estado vacío si no hay ficha médica
  it('muestra mensaje cuando no existe ficha médica', async () => {
    localStorage.setItem('user_id', '123')
    localStorage.setItem('user_name', 'Juan Pérez')

    const { getMedicalRecord } = await import('../../services/MedicalService')
    getMedicalRecord.mockResolvedValueOnce(null)

    render(<ProfilePage />)

    expect(
      await screen.findByText(/Ficha médica no encontrada/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Crear Ficha Médica/i)
    ).toBeInTheDocument()
  })

  //  TEST 3 — Renderiza perfil cuando existe ficha médica
  it('renderiza la información del perfil médico', async () => {
    localStorage.setItem('user_id', '123')
    localStorage.setItem('user_name', 'Juan Pérez')

    const { getMedicalRecord } = await import('../../services/MedicalService')
    getMedicalRecord.mockResolvedValueOnce({
      height: 170,
      initial_weight: 75,
      blood_type: 'O+',
      allergies: 'Ninguna',
      chronic_diseases: 'Ninguna',
      emergency_contact_name: 'María',
      emergency_contact_phone: '+56912345678',
    })

    render(<ProfilePage />)

    expect(
      await screen.findByText(/Juan Pérez/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Datos Corporales/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Emergencia/i)
    ).toBeInTheDocument()
  })
})
