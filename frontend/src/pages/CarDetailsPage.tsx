
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';
import './Pages.css';
import FavoriteButton from '../components/FavoriteButton';

const fuelTypes = [
    'Benzyna',
    'Diesel',
    'Hybryda',
    'Elektryczny',
    'LPG'
];

const bodyTypes = [
    'Hatchback',
    'Sedan',
    'Kombi',
    'SUV',
    'Roadster'
];

export default function CarDetailsPage() {
    const { id } = useParams();

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const favoriteCarIds = useCarUiStore(
        state => state.favoriteCarIds
    );

    const toggleFavorite = useCarUiStore(
        state => state.toggleFavorite
    );

    const isFavorite = car
        ? favoriteCarIds.includes(car.id)
        : false;

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
                setCar(data);
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

    if (loading) {
        return (
            <div className="page-container">
                <p className="page-message">Loading car...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="page-error">Error: {error}</div>

                <Link to="/cars" className="page-button secondary">
                    Powrót do listy
                </Link>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="page-container">
                <p className="page-message">Car not found.</p>

                <Link to="/cars" className="page-button secondary">
                    Powrót do listy
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{car.brand} {car.model}</h1>
                <p>Szczegółowe informacje o samochodzie.</p>
            </div>

            <div className="details-grid">
                <div className="detail-item">
                    <span>ID</span>
                    <strong>{car.id}</strong>
                </div>

                <div className="detail-item">
                    <span>Marka</span>
                    <strong>{car.brand}</strong>
                </div>

                <div className="detail-item">
                    <span>Model</span>
                    <strong>{car.model}</strong>
                </div>

                <div className="detail-item">
                    <span>Liczba drzwi</span>
                    <strong>{car.doorsNumber}</strong>
                </div>

                <div className="detail-item">
                    <span>Pojemność bagażnika</span>
                    <strong>{car.luggageCapacity} l</strong>
                </div>

                <div className="detail-item">
                    <span>Pojemność silnika</span>
                    <strong>{car.engineCapacity} cm³</strong>
                </div>

                <div className="detail-item">
                    <span>Rodzaj paliwa</span>
                    <strong>
                        {fuelTypes[car.fuelType] ?? 'Nieznany'}
                    </strong>
                </div>

                <div className="detail-item">
                    <span>Data produkcji</span>
                    <strong>
                        {car.productionDate.substring(0, 10)}
                    </strong>
                </div>

                <div className="detail-item">
                    <span>Średnie zużycie paliwa</span>
                    <strong>{car.averageFuelConsumption} l/100 km</strong>
                </div>

                <div className="detail-item">
                    <span>Typ nadwozia</span>
                    <strong>
                        {bodyTypes[car.bodyType] ?? 'Nieznany'}
                    </strong>
                </div>
            </div>

            <div className="details-actions">
                <FavoriteButton
                    isFavorite={isFavorite}
                    onClick={() => toggleFavorite(car.id)}
                />
                <Link
                    to={`/cars/${car.id}/edit`}
                    className="page-button"
                >
                    Edytuj samochód
                </Link>

                <Link
                    to="/cars"
                    className="page-button secondary"
                >
                    Powrót do listy
                </Link>
            </div>
        </div>
    );
}
