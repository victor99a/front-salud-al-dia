import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as MedicalService from '../../services/MedicalService';

vi.mock('axios');

describe('MedicalService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem('token', 'token-test');
        // Silenciamos los console.error/warn para que el output del test salga limpio
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    // --- GET MEDICAL RECORD ---
    it('getMedicalRecord retorna datos si existe', async () => {
        const mockData = { allergies: 'None', blood_type: 'O+' };
        axios.get.mockResolvedValue({ data: mockData });

        const result = await MedicalService.getMedicalRecord(1);
        
        expect(result).toEqual(mockData);
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/medical/records/1'),
            expect.objectContaining({ headers: expect.anything() })
        );
    });

    it('getMedicalRecord retorna null si recibe un 404 (No encontrado)', async () => {
        const error404 = { response: { status: 404 } };
        axios.get.mockRejectedValue(error404);

        const result = await MedicalService.getMedicalRecord(1);
        
        expect(result).toBeNull();
        expect(console.warn).toHaveBeenCalled();
    });

    it('getMedicalRecord retorna null ante errores de red generales', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        const result = await MedicalService.getMedicalRecord(1);
        
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalled();
    });

    // --- CREATE MEDICAL RECORD ---
    it('createMedicalRecord crea la ficha correctamente', async () => {
        const mockResponse = { id: 1, status: 'created' };
        axios.post.mockResolvedValue({ data: mockResponse });
        
        const payload = { height: 180, weight: 80 };
        const result = await MedicalService.createMedicalRecord(payload);

        expect(result).toEqual(mockResponse);
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/medical/records'),
            payload,
            expect.anything()
        );
    });

    it('createMedicalRecord lanza error si falla', async () => {
        const errorMsg = 'Datos inválidos';
        axios.post.mockRejectedValue({ response: { data: { error: errorMsg } } });

        await expect(MedicalService.createMedicalRecord({}))
            .rejects
            .toThrow(errorMsg);
    });

    // --- UPDATE MEDICAL RECORD ---
    it('updateMedicalRecord actualiza datos correctamente', async () => {
        const mockResponse = { success: true };
        axios.put.mockResolvedValue({ data: mockResponse });

        const updatePayload = { weight: 82 };
        const result = await MedicalService.updateMedicalRecord(1, updatePayload);

        expect(result).toEqual(mockResponse);
        expect(axios.put).toHaveBeenCalledWith(
            expect.stringContaining('/medical/records/1'),
            updatePayload,
            expect.anything()
        );
    });

    it('updateMedicalRecord lanza error si la actualización falla', async () => {
        const errorMsg = 'Error interno';
        axios.put.mockRejectedValue({ response: { data: { error: errorMsg } } });

        await expect(MedicalService.updateMedicalRecord(1, {}))
            .rejects
            .toThrow(errorMsg);
    });
});