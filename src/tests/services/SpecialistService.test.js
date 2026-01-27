import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as SpecialistService from '../../services/SpecialistService';

vi.mock('axios');

describe('SpecialistService', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem('token', 'token-especialista');
        // Evitamos ruidos en la consola durante los tests
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('getPatients debe retornar la lista de pacientes correctamente', async () => {
        const mockPatients = [{ id: 1, name: 'Juan' }, { id: 2, name: 'Ana' }];
        axios.get.mockResolvedValue({ data: mockPatients });

        const result = await SpecialistService.getPatients();

        expect(result).toEqual(mockPatients);
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/patients'),
            expect.objectContaining({ headers: expect.anything() })
        );
    });

    it('getPatients retorna una lista vacía si hay error', async () => {
        axios.get.mockRejectedValue(new Error('Fail'));

        const result = await SpecialistService.getPatients();
        
        expect(result).toEqual([]); 
        expect(console.error).toHaveBeenCalled();
    });

    it('getPatientDashboardData debe retornar los datos de salud del paciente', async () => {
        const mockHealth = { glucose: { value: 120 }, pressure: { systolic: 120 } };
        axios.get.mockResolvedValue({ data: mockHealth });

        const result = await SpecialistService.getPatientDashboardData(123);

        expect(result).toEqual(mockHealth);
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/registros/dashboard/123'),
            expect.anything()
        );
    });

    it('getPatientDashboardData maneja errores retornando nulos', async () => {
        axios.get.mockRejectedValue(new Error('Fail'));
        
        const result = await SpecialistService.getPatientDashboardData(1);
        
        expect(result).toEqual({ glucose: null, pressure: null });
    });

    it('getPatientHistory debe retornar el historial del paciente', async () => {
        const mockHistory = [{ glucose: 100 }, { glucose: 110 }];
        axios.get.mockResolvedValue({ data: mockHistory });

        const result = await SpecialistService.getPatientHistory(123);

        expect(result).toEqual(mockHistory);
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/registros/historial/123'),
            expect.anything()
        );
    });

    it('getDownloadUrl construye la URL correctamente', () => {
        const url = SpecialistService.getDownloadUrl(123);
        // Verificamos que contenga la base y el ID correcto
        expect(url).toContain('/api/descargas/historial/pdf/123');
    });

    it('getMedicalRecord retorna null si la ficha no existe (404)', async () => {
        axios.get.mockRejectedValue({ response: { status: 404 } });

        const result = await SpecialistService.getMedicalRecord(456);

        expect(result).toBeNull();
    });
});