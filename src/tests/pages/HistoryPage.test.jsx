// Renderiza el título y muestra mensaje cuando no hay historial
// Ejecuta la descarga de historial en PDF y CSV al hacer clic en los botones

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HistoryPage from '../../pages/HistoryPage'

// Mock del servicio de descarga
vi.mock('../../services/downloadService', () => ({
  descargarHistorial: vi.fn(),
}))

// Mock del formateador de fechas
vi.mock('../../utils/formatDate', () => ({
  formatDateLong: (date) => `Fecha: ${date}`,
}))

describe('HistoryPage', () => {
  beforeEach(() => {
    localStorage.setItem('user_id', '123')

    // Mock global de fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    )
  })

  it('renderiza el título y muestra mensaje si no hay registros', async () => {
    render(<HistoryPage />)

    expect(
      await screen.findByText(/Historial de Mediciones/i)
    ).toBeInTheDocument()

    expect(
      await screen.findByText(/No hay registros disponibles/i)
    ).toBeInTheDocument()
  })

  it('llama a descargarHistorial al hacer click en los botones', async () => {
    const { descargarHistorial } = await import(
      '../../services/downloadService'
    )

    render(<HistoryPage />)

    fireEvent.click(
      screen.getByRole('button', { name: /Descargar PDF/i })
    )

    fireEvent.click(
      screen.getByRole('button', { name: /Descargar CSV/i })
    )

    expect(descargarHistorial).toHaveBeenCalledWith('123', 'pdf')
    expect(descargarHistorial).toHaveBeenCalledWith('123', 'csv')
  })
})
