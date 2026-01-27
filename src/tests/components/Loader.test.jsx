import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from '../../components/Loader';

describe('Loader.jsx', () => {
  it('debe mostrar el mensaje por defecto', () => {
    render(<Loader />);
    expect(screen.getByText('Cargando sistema...')).toBeInTheDocument();
  });

  it('debe mostrar un mensaje personalizado', () => {
    render(<Loader message="Procesando datos..." />);
    expect(screen.getByText('Procesando datos...')).toBeInTheDocument();
  });
});