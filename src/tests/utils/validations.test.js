import { describe, it, expect } from 'vitest';
import { formatRut, isValidEmail } from '../../utils/validations';

describe('validations.js', () => {
  
  describe('formatRut', () => {
    it('debe formatear correctamente un RUT estándar', () => {
      expect(formatRut('123456789')).toBe('12.345.678-9');
    });

    it('debe formatear correctamente un RUT con K', () => {
      expect(formatRut('12345678k')).toBe('12.345.678-K'); 
    });

    it('debe manejar RUTs de menos de 7 dígitos', () => {
      expect(formatRut('12345k')).toBe('12.345-K');
    });

    it('debe limpiar caracteres especiales antes de formatear', () => {
      expect(formatRut('12.345.678-9')).toBe('12.345.678-9');
    });

    it('debe retornar string vacío si el input es inválido', () => {
      expect(formatRut('')).toBe('');
      expect(formatRut(null)).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('debe retornar true para emails válidos', () => {
      expect(isValidEmail('yeider@duoc.cl')).toBe(true);
      expect(isValidEmail('test.user@gmail.com')).toBe(true);
    });

    it('debe retornar false para formatos de correo inválidos', () => {
      expect(isValidEmail('yeiderduoc.cl')).toBe(false);
      expect(isValidEmail('yeider@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });
});