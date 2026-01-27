import { describe, it, expect } from 'vitest';
import { getLastReading } from '../../services/readingsService';

describe('readingsService', () => {
    it('getLastReading devuelve los datos estáticos esperados', () => {
        const reading = getLastReading();
        
        // Verificamos la estructura completa
        expect(reading).toEqual({
            glucose: 300,
            systolic: 134,
            diastolic: 92,
            date: "13 de enero, 14:02",
        });
    });
});