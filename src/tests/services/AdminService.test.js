import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as AdminService from '../../services/AdminService';

vi.mock('axios');

describe('AdminService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem('token', 'fake-token');
    });

    // --- GET STATS ---
    it('getStats debe retornar datos cuando la respuesta es exitosa', async () => {
        const mockData = { users: 10, specialists: 5 };
        axios.get.mockResolvedValue({ data: mockData });

        const result = await AdminService.getStats();

        expect(result).toEqual(mockData);
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/stats'),
            expect.objectContaining({ headers: expect.anything() })
        );
    });

    it('getStats debe retornar null si hay error', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));
        const result = await AdminService.getStats();
        expect(result).toBeNull();
    });

    // --- GET USERS ---
    it('getUsers debe retornar lista de usuarios', async () => {
        const mockUsers = [{ id: 1, name: 'Pepe' }];
        axios.get.mockResolvedValue({ data: mockUsers });

        const result = await AdminService.getUsers();
        expect(result).toEqual(mockUsers);
    });

    it('getUsers debe retornar array vacío si falla', async () => {
        axios.get.mockRejectedValue(new Error('Fail'));
        const result = await AdminService.getUsers();
        expect(result).toEqual([]);
    });

    // --- CREATE SPECIALIST ---
    it('createSpecialist debe retornar success: true si funciona', async () => {
        axios.post.mockResolvedValue({ data: {} });
        const userData = { email: 'doc@test.com' };

        const result = await AdminService.createSpecialist(userData);

        expect(result).toEqual({ success: true });
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/create-specialist'),
            userData,
            expect.anything()
        );
    });

    it('createSpecialist debe retornar el mensaje de error si falla', async () => {
        const errorMessage = 'Email duplicado';
        axios.post.mockRejectedValue({ 
            response: { data: { error: errorMessage } } 
        });

        const result = await AdminService.createSpecialist({});
        expect(result).toEqual({ success: false, error: errorMessage });
    });

    // --- DELETE USER ---
    it('deleteUser debe eliminar usuario correctamente', async () => {
        axios.delete.mockResolvedValue({ data: {} });
        const result = await AdminService.deleteUser(123);
        expect(result).toEqual({ success: true });
        expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/users/123'), expect.anything());
    });

    // --- VERIFY ADMIN ---
    it('verifyAdminStatus debe retornar true si es admin', async () => {
        axios.post.mockResolvedValue({ data: { isAdmin: true } });
        const result = await AdminService.verifyAdminStatus('admin@test.com');
        expect(result).toBe(true);
    });

    it('verifyAdminStatus debe retornar false si falla', async () => {
        axios.post.mockRejectedValue(new Error('Not admin'));
        const result = await AdminService.verifyAdminStatus('user@test.com');
        expect(result).toBe(false);
    });

    // --- REQUEST DELETION ---
    it('requestAccountDeletion debe enviar la solicitud correctamente', async () => {
        axios.patch.mockResolvedValue({ data: {} });
        const result = await AdminService.requestAccountDeletion(999);
        expect(result).toEqual({ success: true });
        expect(axios.patch).toHaveBeenCalledWith(expect.stringContaining('/users/request-deletion/999'), {}, expect.anything());
    });
});