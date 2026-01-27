import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import * as AuthService from '../../services/AuthService';

vi.mock('axios');

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('isAdmin', () => {
        it('debe retornar false si no hay email o token', async () => {
            const result = await AuthService.isAdmin();
            expect(result).toBe(false);
            expect(axios.post).not.toHaveBeenCalled();
        });

        it('debe retornar true si la API confirma que es admin', async () => {
            localStorage.setItem('user_email', 'admin@test.com');
            localStorage.setItem('token', 'valid-token');
            
            axios.post.mockResolvedValue({ data: { isAdmin: true } });

            const result = await AuthService.isAdmin();
            expect(result).toBe(true);
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/verify-admin'),
                { email: 'admin@test.com' },
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer valid-token'
                    })
                })
            );
        });

        it('debe retornar false si ocurre un error en la petición', async () => {
            localStorage.setItem('user_email', 'user@test.com');
            localStorage.setItem('token', 'valid-token');
            axios.post.mockRejectedValue(new Error('Error'));

            const result = await AuthService.isAdmin();
            expect(result).toBe(false);
        });
    });

    describe('getUserProfile', () => {
        it('debe retornar los datos del usuario si la petición es exitosa', async () => {
            const mockUser = { id: 123, role: 'specialist' };
            axios.get.mockResolvedValue({ data: mockUser });

            const result = await AuthService.getUserProfile(123, 'token-123');
            
            expect(result).toEqual(mockUser);
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('/users/123'),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer token-123'
                    })
                })
            );
        });

        it('debe retornar null si la petición falla', async () => {
            axios.get.mockRejectedValue(new Error('User not found'));
            const result = await AuthService.getUserProfile(999, 'token-fail');
            
            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('requestPublicPasswordReset', () => {
        it('debe retornar éxito al solicitar reset', async () => {
            axios.post.mockResolvedValue({});
            const result = await AuthService.requestPublicPasswordReset('test@mail.com');
            expect(result).toEqual({ success: true });
        });

        it('debe retornar error con mensaje si falla', async () => {
            const errMsg = 'Email no registrado';
            axios.post.mockRejectedValue({ response: { data: { error: errMsg } } });

            const result = await AuthService.requestPublicPasswordReset('fail@mail.com');
            expect(result).toEqual({ success: false, error: errMsg });
        });
    });
});