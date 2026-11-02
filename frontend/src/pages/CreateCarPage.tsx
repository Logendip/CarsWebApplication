
import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { FormEvent } from 'react';
import type { NewCar } from '../models/Car';
import { createCar } from '../services/carService';

export default function CreateCarPage() {
    const navigate = useNavigate();

    const [car, setCar] = useState<NewCar>({
        brand: '',
        model: '',
        doorsNumber: 0,
        luggageCapacity: 0,
        engineCapacity: 0,
        fuelType: 0,
        productionDate: '',
        averageFuelConsumption: 0,
        bodyType: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setError('');

        try {
            const newCar: NewCar = {
                brand: car.brand,
                model: car.model,
                doorsNumber: car.doorsNumber,
                luggageCapacity: car.luggageCapacity,
                engineCapacity: car.engineCapacity,
                fuelType: car.fuelType,
                productionDate: car.productionDate,
                averageFuelConsumption: car.averageFuelConsumption,
                bodyType: car.bodyType
            };

            const createdCar = await createCar(newCar);

            navigate(`/cars/${createdCar.id}`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to create car.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Dodaj samochód</h1>

            {error && <p>Error: {error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Marka:</label>
                    <input
                        type="text"
                        value={car.brand}
                        onChange={e => setCar({ ...car, brand: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Model:</label>
                    <input
                        type="text"
                        value={car.model}
                        onChange={e => setCar({ ...car, model: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Liczba drzwi:</label>
                    <input
                        type="number"
                        min="1"
                        value={car.doorsNumber}
                        onChange={e => setCar({ ...car, doorsNumber: Number(e.target.value) })}
                        required
                    />
                </div>

                <div>
                    <label>Pojemność bagażnika (l):</label>
                    <input
                        type="number"
                        min="0"
                        value={car.luggageCapacity}
                        onChange={e => setCar({ ...car, luggageCapacity: Number(e.target.value) })}
                        required
                    />
                </div>

                <div>
                    <label>Pojemność silnika (cm³):</label>
                    <input
                        type="number"
                        min="0"
                        value={car.engineCapacity}
                        onChange={e => setCar({ ...car, engineCapacity: Number(e.target.value) })}
                        required
                    />
                </div>

                <div>
                    <label>Rodzaj paliwa:</label>
                    <input
                        type="number"
                        min="0"
                        value={car.fuelType}
                        onChange={e => setCar({ ...car, fuelType: Number(e.target.value) })}
                        required
                    />
                </div>

                <div>
                    <label>Data produkcji:</label>
                    <input
                        type="date"
                        value={car.productionDate}
                        onChange={e => setCar({ ...car, productionDate: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Średnie spalanie (l/100 km):</label>
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={car.averageFuelConsumption}
                        onChange={e => setCar({ ...car, averageFuelConsumption: Number(e.target.value) })}
                        required
                    />
                </div>

                <div>
                    <label>Typ nadwozia:</label>
                    <input
                        type="number"
                        min="0"
                        value={car.bodyType}
                        onChange={e => setCar({ ...car, bodyType: Number(e.target.value) })}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Dodawanie...' : 'Dodaj samochód'}
                </button>
            </form>
        </div>
    );
}
