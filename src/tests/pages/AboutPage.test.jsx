// Renderiza el contenido principal//
 //Navega correctamente al hacer clic en el botón//

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AboutPage from '../../pages/AboutPage'

// Mock de react-router-dom
const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

describe('AboutPage', () => {
  it('renderiza el título principal de la página', () => {
    render(<AboutPage />)

    const title = screen.getByText(/Cuidando tu salud con tecnología/i)
    expect(title).toBeInTheDocument()
  })

  it('navega a /signup al hacer click en el botón', () => {
    render(<AboutPage />)

    const button = screen.getByRole('button', {
      name: /Crear Cuenta Ahora/i,
    })

    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/signup')
  })
})
