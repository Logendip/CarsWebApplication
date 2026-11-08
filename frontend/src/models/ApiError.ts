export interface ApiValidationErrors {
    [field: string]: string[];
}

export class ApiError extends Error {
    status: number;
    errors: ApiValidationErrors;

    constructor(
        message: string,
        status: number,
        errors: ApiValidationErrors = {}
    ) {
        super(message);

        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}