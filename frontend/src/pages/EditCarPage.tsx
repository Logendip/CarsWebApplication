
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { FormEvent } from 'react';
import axios from 'axios';
import type { NewCar } from '../models/Car';
import { ApiError } from '../models/ApiError';
import {
    getCarById,
    updateCar as updateCarRequest
} from '../services/carService';
import './CreateCarPage.css';

const fuelTypes = [
    { value: 0, label: 'Benzyna' },
    { value: 1, label: 'Diesel' },
    { value: 2, label: 'Hybryda' },
    { value: 3, label: 'Elektryczny' },
    { value: 4, label: 'LPG' }
];

const bodyTypes = [
    { value: 0, label: 'Hatchback' },
    { value: 1, label: 'Sedan' },
    { value: 2, label: 'Kombi' },
    { value: 3, label: 'SUV' },
    { value: 4, label: 'Roadster' }
];

type CarFormState = Omit<
    NewCar,
    'doorsNumber' | 'luggageCapacity' | 'engineCapacity' | 'averageFuelConsumption'
> & {
    doorsNumber: string;
    luggageCapacity: string;
    engineCapacity: string;
    averageFuelConsumption: string;
};

type CarFormErrors = Partial<Record<keyof CarFormState, string>>;

function mapApiErrors(errors: Record<string, string[]>): CarFormErrors {
    const mappedErrors: CarFormErrors = {};

    const fields: (keyof CarFormState)[] = [
        'brand',
        'model',
        'doorsNumber',
        'luggageCapacity',
        'engineCapacity',
        'fuelType',
        'productionDate',
        'averageFuelConsumption',
        'bodyType'
    ];

    for (const [field, messages] of Object.entries(errors)) {
        const propertyName = field.split('.').pop();

        if (!propertyName) continue;

        const formField =
            propertyName.charAt(0).toLowerCase() + propertyName.slice(1);

        if (fields.includes(formField as keyof CarFormState)) {
            mappedErrors[formField as keyof CarFormState] = messages.join(' ');
        }
    }

    return mappedErrors;
}

export default function EditCarPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState<CarFormState | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<CarFormErrors>({});

    useEffect(() => {
        const controller = new AbortController();

        if (!id) {
            setError('Car ID not found.');
            setLoading(false);

            return () => controller.abort();
        }

        async function loadCar() {
            try {
                const data = await getCarById(id!, controller.signal);

                setCar({
                    brand: data.brand,
                    model: data.model,
                    doorsNumber: String(data.doorsNumber),
                    luggageCapacity: String(data.luggageCapacity),
                    engineCapacity: String(data.engineCapacity),
                    fuelType: data.fuelType,
                    productionDate: data.productionDate.substring(0, 10),
                    averageFuelConsumption: String(data.averageFuelConsumption),
                    bodyType: data.bodyType
                });
            } catch (err) {
                if (axios.isCancel(err)) {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load car.'
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadCar();

        return () => controller.abort();
    }, [id]);

    function updateCar<K extends keyof CarFormState>(
        field: K,
        value: CarFormState[K]
    ) {
        setCar(previous => {
            if (!previous) return previous;

            return {
                ...previous,
                [field]: value
            };
        });

        setFieldErrors(previous => ({
            ...previous,
            [field]: undefined
        }));

        setError('');
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!id || !car) {
            return;
        }

        setError('');
        setFieldErrors({});

        if (
            !car.doorsNumber.trim() ||
            !car.luggageCapacity.trim() ||
            !car.engineCapacity.trim() ||
            !car.averageFuelConsumption.trim()
        ) {
            setError('Uzupełnij wszystkie pola liczbowe.');
            return;
        }

        setSaving(true);

        try {
            const updatedCar: NewCar = {
                brand: car.brand,
                model: car.model,
                doorsNumber: Number(car.doorsNumber),
                luggageCapacity: Number(car.luggageCapacity),
                engineCapacity: Number(car.engineCapacity),
                fuelType: car.fuelType,
                productionDate: car.productionDate,
                averageFuelConsumption: Number(car.averageFuelConsumption),
                bodyType: car.bodyType
            };

            await updateCarRequest(id, updatedCar);

            navigate(`/cars/${id}`);
        } catch (err) {
            if (err instanceof ApiError) {
                setFieldErrors(mapApiErrors(err.errors));

                if (Object.keys(err.errors).length === 0) {
                    setError(err.message);
                }
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to update car.'
                );
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="create-car-page">
                <p>Loading car...</p>
            </div>
        );
    }

    if (error && !car) {
        return (
            <div className="create-car-page">
                <div className="create-car-header">
                    <h1>Edytuj samochód</h1>
                </div>

                <div className="create-car-error">
                    {error}
                </div>

                <div className="create-car-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate('/cars')}
                    >
                        Powrót do listy
                    </button>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="create-car-page">
                <p>Car not found.</p>
            </div>
        );
    }

    return (
        <div className="create-car-page">
            <div className="create-car-header">
                <h1>Edytuj samochód</h1>
                <p>Zmodyfikuj dane samochodu i zapisz zmiany.</p>
            </div>

            {error && (
                <div className="create-car-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="create-car-form">
                <div className="form-grid">
                    <div className="form-field">
                        <label htmlFor="brand">Marka:</label>
                        <input
                            id="brand"
                            type="text"
                            value={car.brand}
                            onChange={e => updateCar('brand', e.target.value)}
                            className={fieldErrors.brand ? 'input-error' : ''}
                            required
                        />
                        {fieldErrors.brand && (
                            <span className="field-error">{fieldErrors.brand}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="model">Model:</label>
                        <input
                            id="model"
                            type="text"
                            value={car.model}
                            onChange={e => updateCar('model', e.target.value)}
                            className={fieldErrors.model ? 'input-error' : ''}
                            required
                        />
                        {fieldErrors.model && (
                            <span className="field-error">{fieldErrors.model}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="doorsNumber">Liczba drzwi:</label>
                        <input
                            id="doorsNumber"
                            type="number"
                            min="2"
                            max="5"
                            value={car.doorsNumber}
                            onChange={e => updateCar('doorsNumber', e.target.value)}
                            className={fieldErrors.doorsNumber ? 'input-error' : ''}
                            required
                        />
                        {fieldErrors.doorsNumber && (
                            <span className="field-error">{fieldErrors.doorsNumber}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="luggageCapacity">Pojemność bagażnika (l):</label>
                        <input
                            id="luggageCapacity"
                            type="number"
                            min="0"
                            value={car.luggageCapacity}
                            onChange={e => updateCar('luggageCapacity', e.target.value)}
                            className={fieldErrors.luggageCapacity ? 'input-error' : ''}
                            required
                        />
                        {fieldErrors.luggageCapacity && (
                            <span className="field-error">{fieldErrors.luggageCapacity}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="engineCapacity">Pojemność silnika (cm³):</label>
                        <input
                            id="engineCapacity"
                            type="number"
                            min="1"
                            value={car.engineCapacity}
                            onChange={e => updateCar('engineCapacity', e.target.value)}
                            className={fieldErrors.engineCapacity ? 'input-error' : ''}
                            required
                        />
                        {fieldErrors.engineCapacity && (
                            <span className="field-error">{fieldErrors.engineCapacity}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="fuelType">Rodzaj paliwa:</label>
                        <select
                            id="fuelType"
                            value={car.fuelType}
                            onChange={e => updateCar('fuelType', Number(e.target.value))}
                            className={fieldErrors.fuelType ? 'input-error' : ''}
                        >
                            {fuelTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        {fieldErrors.fuelType && (
                            <span className="field-error">{fieldErrors.fuelType}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="productionDate">Data produkcji:</label>
                        <input
                            id="productionDate"
                            type="date"
                            value={car.productionDate}
                            onChange={e => updateCar('productionDate', e.target.value)}
                            className={fieldErrors.productionDate ? 'input-error' : ''}
                            required
                        />
                        {fieldErrors.productionDate && (
                            <span className="field-error">{fieldErrors.productionDate}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="averageFuelConsumption">
                            Średnie spalanie (l/100 km):
                        </label>
                        <input
                            id="averageFuelConsumption"
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Np. 6.5"
                            value={car.averageFuelConsumption}
                            onChange={e => updateCar('averageFuelConsumption', e.target.value)}
                            className={fieldErrors.averageFuelConsumption ? 'input-error' : ''}
                            required
                        />
                        {fieldErrors.averageFuelConsumption && (
                            <span className="field-error">
                                {fieldErrors.averageFuelConsumption}
                            </span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="bodyType">Typ nadwozia:</label>
                        <select
                            id="bodyType"
                            value={car.bodyType}
                            onChange={e => updateCar('bodyType', Number(e.target.value))}
                            className={fieldErrors.bodyType ? 'input-error' : ''}
                        >
                            {bodyTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        {fieldErrors.bodyType && (
                            <span className="field-error">{fieldErrors.bodyType}</span>
                        )}
                    </div>
                </div>

                <div className="create-car-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate(`/cars/${id}`)}
                    >
                        Anuluj
                    </button>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={saving}
                    >
                        {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                    </button>
                </div>
            </form>
        </div>
    );
}
