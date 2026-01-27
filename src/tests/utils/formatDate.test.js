import { describe, it, expect } from 'vitest';
import { formatDateLong } from '../../utils/formatDate';

describe('formatDate.js', () => {
  it('debe retornar string vacío si la fecha es nula o indefinida', () => {
    expect(formatDateLong(null)).toBe('');
    expect(formatDateLong('')).toBe('');
  });

  it('debe formatear correctamente una fecha completa', () => {
    const mockDate = new Date('2023-10-25T14:30:00');
    const result = formatDateLong(mockDate);

    expect(result).toMatch(/miércoles/i); 
    expect(result).toMatch(/25 de octubre/i); 
    expect(result).toMatch(/14:30 pm/); 
  });

  it('debe capitalizar la primera letra del día', () => {
    const mockDate = new Date('2023-10-25T09:00:00');
    const result = formatDateLong(mockDate);
    
    expect(result.charAt(0)).toBe(result.charAt(0).toUpperCase());
  });

  it('debe manejar correctamente el horario am', () => {
    const mockDate = new Date('2023-10-25T09:15:00');
    const result = formatDateLong(mockDate);
    
    expect(result).toMatch(/09:15 am/);
  });
});