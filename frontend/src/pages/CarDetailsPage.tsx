
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';

export default function CarDetailsPage() {
    const { id } = useParams();

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
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
                setCar(data);
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

    if (loading) {
        return <p>Loading car...</p>;
    }

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
                <Link to="/cars">Powrót do listy</Link>
            </div>
        );
    }

    if (!car) {
        return (
            <div>
                <p>Car not found.</p>
                <Link to="/cars">Powrót do listy</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>{car.brand} {car.model}</h1>

            <p><strong>ID:</strong> {car.id}</p>
            <p><strong>Marka:</strong> {car.brand}</p>
            <p><strong>Model:</strong> {car.model}</p>
            <p><strong>Liczba drzwi:</strong> {car.doorsNumber}</p>
            <p><strong>Pojemność bagażnika:</strong> {car.luggageCapacity} l</p>
            <p><strong>Pojemność silnika:</strong> {car.engineCapacity} cm³</p>
            <p><strong>Rodzaj paliwa:</strong> {car.fuelType}</p>
            <p><strong>Data produkcji:</strong> {car.productionDate}</p>
            <p><strong>Średnie zużycie paliwa:</strong> {car.averageFuelConsumption} l/100 km</p>
            <p><strong>Typ nadwozia:</strong> {car.bodyType}</p>
            <p><Link to={`/cars/${car.id}/edit`}>Edytuj</Link></p>
            <Link to="/cars">Powrót do listy</Link>
        </div>
    );
}
