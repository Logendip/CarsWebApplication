import axios from 'axios';
import type { Car, NewCar } from '../models/Car';
import { ApiError } from '../models/ApiError';
import { apiClient } from '../api/apiClient';

function createServiceError(error: unknown, message: string): Error {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const responseData = error.response.data;

            const errors: Record<string, string[]> =
                responseData?.errors ?? {};

            const details = Object.values(errors)
                .flat()
                .join(' ');

            return new ApiError(
                details || responseData?.title || message,
                error.response.status,
                errors
            );
        }

        if (error.request) {
            return new Error(
                `${message}. No response received from server.`,
                { cause: error }
            );
        }

        return new Error(`${message}. ${error.message}`, {
            cause: error
        });
    }

    return new Error(message, { cause: error });
}

export async function getCars(signal?: AbortSignal): Promise<Car[]> {
    try {
        const response = await apiClient.get<Car[]>('/cars', { signal });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) throw error;
        throw createServiceError(error, 'Failed to fetch cars');
    }
}

export async function getCarById(
    id: string,
    signal?: AbortSignal
): Promise<Car> {
    try {
        const response = await apiClient.get<Car>(`/cars/${id}`, { signal });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) throw error;
        throw createServiceError(error, 'Failed to fetch car');
    }
}

export async function createCar(car: NewCar): Promise<Car> {
    try {
        const response = await apiClient.post<Car>('/cars', car);
        return response.data;
    } catch (error) {
        throw createServiceError(error, 'Failed to create car');
    }
}

export async function updateCar(id: string, car: NewCar): Promise<void> {
    try {
        await apiClient.put(`/cars/${id}`, car);
    } catch (error) {
        throw createServiceError(error, 'Failed to update car');
    }
}

export async function deleteCar(id: string): Promise<void> {
    try {
        await apiClient.delete(`/cars/${id}`);
    } catch (error) {
        throw createServiceError(error, 'Failed to delete car');
    }
}