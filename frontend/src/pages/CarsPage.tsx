
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function loadCars() {
            try {
                const data = await getCars();
                setCars(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Failed to load cars.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadCars();
    }, []);

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            'Czy na pewno chcesz usunąć ten samochód?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteCar(id);
            setCars(cars.filter(car => car.id !== id));
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to delete car.'
            );
        }
    }

    const filteredCars = cars.filter(car =>
        `${car.brand} ${car.model}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) {
        return <p>Loading cars...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (cars.length === 0) {
        return <p>No cars found.</p>;
    }

    return (
        <div>
            <h1>Cars</h1>

            <input
                type="text"
                placeholder="Szukaj według marki lub modelu..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {filteredCars.length === 0 ? (
                <p>Nie znaleziono samochodów.</p>
            ) : (
                <ul>
                    {filteredCars.map(car => (
                        <li key={car.id}>
                            <strong>{car.brand} {car.model}</strong>
                            {' '}
                            <Link to={`/cars/${car.id}`}>Szczegóły</Link>
                            {' '}
                            <Link to={`/cars/${car.id}/edit`}>Edytuj</Link>
                            {' '}
                            <button onClick={() => handleDelete(car.id)}>
                                Usuń
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
