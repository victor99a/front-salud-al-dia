import { describe, it, expect } from 'vitest';
import { formatDateDownload } from '../../utils/formatDateDownload';

describe('formatDateDownload.js', () => {
  it('debe retornar string vacío si no hay fecha', () => {
    expect(formatDateDownload(null)).toBe('');
  });

  it('debe incluir el año y el formato de hora para archivos', () => {
    const mockDate = new Date('2023-12-31T23:59:00');
    const result = formatDateDownload(mockDate);

    expect(result).toMatch(/2023/);
    expect(result).toMatch(/31 de diciembre/i);
    expect(result).toMatch(/23:59 pm/);
  });
});