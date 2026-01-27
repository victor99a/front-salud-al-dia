import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as AdminService from '../../services/AdminService';

vi.mock('axios');

describe('AdminService', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem('token', 'fake-token');
    });


    it('getStats retorna datos cuando es exitoso', async () => {
        const mockData = { users: 10 };
        axios.get.mockResolvedValue({ data: mockData });

        const result = await AdminService.getStats();

        expect(result).toEqual(mockData);
    });

    it('getStats retorna null cuando hay error', async () => {
        axios.get.mockRejectedValue(new Error('Fail'));

        const result = await AdminService.getStats();

        expect(result).toBeNull();
    });


    it('getUsers retorna usuarios', async () => {
        const users = [{ id: 1 }];
        axios.get.mockResolvedValue({ data: users });

        const result = await AdminService.getUsers();

        expect(result).toEqual(users);
    });

    it('getUsers retorna array vacío si falla', async () => {
        axios.get.mockRejectedValue(new Error('Fail'));

        const result = await AdminService.getUsers();

        expect(result).toEqual([]);
    });

 
    it('createSpecialist retorna success true', async () => {
        axios.post.mockResolvedValue({});

        const result = await AdminService.createSpecialist({ email: 'test@test.com' });

        expect(result).toEqual({ success: true });
    });

    it('createSpecialist retorna error desde backend', async () => {
        axios.post.mockRejectedValue({
            response: { data: { error: 'Email duplicado' } }
        });

        const result = await AdminService.createSpecialist({});

        expect(result).toEqual({
            success: false,
            error: 'Email duplicado'
        });
    });

    it('createSpecialist retorna error.message si no hay response', async () => {
        axios.post.mockRejectedValue(new Error('Server down'));

        const result = await AdminService.createSpecialist({});

        expect(result).toEqual({
            success: false,
            error: 'Server down'
        });
    });


    it('resetUserPassword retorna success true', async () => {
        axios.post.mockResolvedValue({});

        const result = await AdminService.resetUserPassword('test@test.com');

        expect(result).toEqual({ success: true });
    });

    it('resetUserPassword retorna error.message si falla', async () => {
        axios.post.mockRejectedValue(new Error('Fail'));

        const result = await AdminService.resetUserPassword('test@test.com');

        expect(result).toEqual({
            success: false,
            error: 'Fail'
        });
    });

 
    it('updatePasswordFinal retorna success true', async () => {
        axios.post.mockResolvedValue({});

        const result = await AdminService.updatePasswordFinal('test@test.com', '1234');

        expect(result).toEqual({ success: true });
    });

    it('updatePasswordFinal retorna error.message si falla', async () => {
        axios.post.mockRejectedValue(new Error('Fail'));

        const result = await AdminService.updatePasswordFinal('test@test.com', '1234');

        expect(result).toEqual({
            success: false,
            error: 'Fail'
        });
    });

    it('deleteUser retorna success true', async () => {
        axios.delete.mockResolvedValue({});

        const result = await AdminService.deleteUser(1);

        expect(result).toEqual({ success: true });
    });

    it('deleteUser retorna error.message si falla', async () => {
        axios.delete.mockRejectedValue(new Error('Fail'));

        const result = await AdminService.deleteUser(1);

        expect(result).toEqual({
            success: false,
            error: 'Fail'
        });
    });

  
    it('requestAccountDeletion retorna success true', async () => {
        axios.patch.mockResolvedValue({});

        const result = await AdminService.requestAccountDeletion(1);

        expect(result).toEqual({ success: true });
    });

    it('requestAccountDeletion retorna error.message si falla', async () => {
        axios.patch.mockRejectedValue(new Error('Fail'));

        const result = await AdminService.requestAccountDeletion(1);

        expect(result).toEqual({
            success: false,
            error: 'Fail'
        });
    });


    it('verifyAdminStatus retorna true si es admin', async () => {
        axios.post.mockResolvedValue({ data: { isAdmin: true } });

        const result = await AdminService.verifyAdminStatus('ADMIN@TEST.COM');

        expect(result).toBe(true);
    });

    it('verifyAdminStatus retorna undefined si isAdmin no viene', async () => {
        axios.post.mockResolvedValue({ data: {} });

        const result = await AdminService.verifyAdminStatus('test@test.com');

        expect(result).toBeUndefined();
    });

    it('verifyAdminStatus retorna false si falla', async () => {
        axios.post.mockRejectedValue(new Error('Fail'));

        const result = await AdminService.verifyAdminStatus('test@test.com');

        expect(result).toBe(false);
    });

});
