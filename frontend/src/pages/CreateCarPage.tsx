
import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { FormEvent } from 'react';
import { createCar } from '../services/carService';
import { ApiError } from '../models/ApiError';
import type { NewCar } from '../models/Car';
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

type CarFormState = {
    brand: string;
    model: string;
    doorsNumber: string;
    luggageCapacity: string;
    engineCapacity: string;
    fuelType: number;
    productionDate: string;
    averageFuelConsumption: string;
    bodyType: number;
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

export default function CreateCarPage() {
    const navigate = useNavigate();

    const [car, setCar] = useState<CarFormState>({
        brand: '',
        model: '',
        doorsNumber: '4',
        luggageCapacity: '',
        engineCapacity: '',
        fuelType: 0,
        productionDate: '',
        averageFuelConsumption: '',
        bodyType: 0
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<CarFormErrors>({});

    function updateCar<K extends keyof CarFormState>(
        field: K,
        value: CarFormState[K]
    ) {
        setCar(previous => ({
            ...previous,
            [field]: value
        }));

        setFieldErrors(previous => ({
            ...previous,
            [field]: undefined
        }));

        setError('');
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

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
            const newCar: NewCar = {
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

            const createdCar = await createCar(newCar);

            navigate(`/cars/${createdCar.id}`);
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
                        : 'Failed to create car.'
                );
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="create-car-page">
            <div className="create-car-header">
                <h1>Dodaj samochód</h1>
                <p>Wprowadź dane samochodu, aby dodać go do bazy.</p>
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
                        {fieldErrors.brand && <span className="field-error">{fieldErrors.brand}</span>}
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
                        {fieldErrors.model && <span className="field-error">{fieldErrors.model}</span>}
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
                        {fieldErrors.doorsNumber && <span className="field-error">{fieldErrors.doorsNumber}</span>}
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
                        {fieldErrors.luggageCapacity && <span className="field-error">{fieldErrors.luggageCapacity}</span>}
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
                        {fieldErrors.engineCapacity && <span className="field-error">{fieldErrors.engineCapacity}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="fuelType">Rodzaj paliwa:</label>
                        <select
                            id="fuelType"
                            value={car.fuelType}
                            onChange={e => updateCar('fuelType', Number(e.target.value))}
                        >
                            {fuelTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
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
                        {fieldErrors.productionDate && <span className="field-error">{fieldErrors.productionDate}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="averageFuelConsumption">Średnie spalanie (l/100 km):</label>
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
                        {fieldErrors.averageFuelConsumption && <span className="field-error">{fieldErrors.averageFuelConsumption}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="bodyType">Typ nadwozia:</label>
                        <select
                            id="bodyType"
                            value={car.bodyType}
                            onChange={e => updateCar('bodyType', Number(e.target.value))}
                        >
                            {bodyTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="create-car-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate('/cars')}
                    >
                        Anuluj
                    </button>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={saving}
                    >
                        {saving ? 'Zapisywanie...' : 'Dodaj samochód'}
                    </button>
                </div>
            </form>
        </div>
    );
}
