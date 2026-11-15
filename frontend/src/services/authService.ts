
import { apiClient } from '../api/apiClient';
import type { User, LoginData, RegisterData } from '../models/Auth';

export const authService = {
    async login(data: LoginData): Promise<User> {
        const response = await apiClient.post<User>(
            '/account/login',
            data
        );

        return response.data;
    },

    async register(data: RegisterData): Promise<string> {
        const response = await apiClient.post(
            '/account/register',
            data
        );

        return response.data.message;
    },

    async confirmEmail(userId: string, token: string): Promise<void> {
        await apiClient.get('/account/confirm-email', {
            params: { userId, token }
        });
    },

    async forgotPassword(email: string): Promise<void> {
        await apiClient.post('/account/forgot-password', {
            email
        });
    },

    async resetPassword(
        email: string,
        token: string,
        newPassword: string
    ): Promise<void> {
        await apiClient.post('/account/reset-password', {
            email,
            token,
            newPassword
        });
    }
};
