
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { FormEvent } from 'react';
import type { NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';

export default function EditCarPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState<NewCar | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) {
            setError('Car ID not found.');
            setLoading(false);
            return;
        }

        async function loadCar() {
            try {
                const data = await getCarById(id!);

                setCar({
                    brand: data.brand,
                    model: data.model,
                    doorsNumber: data.doorsNumber,
                    luggageCapacity: data.luggageCapacity,
                    engineCapacity: data.engineCapacity,
                    fuelType: data.fuelType,
                    productionDate: data.productionDate,
                    averageFuelConsumption: data.averageFuelConsumption,
                    bodyType: data.bodyType
                });
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load car.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadCar();
    }, [id]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!id || !car) {
            return;
        }

        setSaving(true);
        setError('');

        try {
            const updatedCar: NewCar = {
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

            await updateCar(id, updatedCar);

            navigate(`/cars/${id}`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to update car.'
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <p>Loading car...</p>;
    }

    if (error && !car) {
        return (
            <div>
                <p>Error: {error}</p>
                <button onClick={() => navigate('/cars')}>
                    Powrót do listy
                </button>
            </div>
        );
    }

    if (!car) {
        return <p>Car not found.</p>;
    }

    return (
        <div>
            <h1>Edytuj samochód</h1>

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

                <button type="submit" disabled={saving}>
                    {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
            </form>

            <p>
                <button onClick={() => navigate(`/cars/${id}`)}>
                    Anuluj
                </button>
            </p>
        </div>
    );
}
