
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';
import './Pages.css';
import FavoriteButton from '../components/FavoriteButton';

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const searchTerm = useCarUiStore(state => state.searchTerm);
    const showFavoritesOnly = useCarUiStore(state => state.showFavoritesOnly);
    const favoriteCarIds = useCarUiStore(state => state.favoriteCarIds);

    const setSearchTerm = useCarUiStore(state => state.setSearchTerm);
    const setShowFavoritesOnly = useCarUiStore(
        state => state.setShowFavoritesOnly
    );
    const toggleFavorite = useCarUiStore(state => state.toggleFavorite);
    const removeFavorite = useCarUiStore(state => state.removeFavorite);

    useEffect(() => {
        const controller = new AbortController();

        async function loadCars() {
            try {
                const data = await getCars(controller.signal);
                setCars(data);
            } catch (err) {
                if (axios.isCancel(err)) return;

                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load cars.'
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadCars();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!selectedCar || isDeleting) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setSelectedCar(null);
                setDeleteError('');
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedCar, isDeleting]);

    function handleDeleteClick(car: Car) {
        setDeleteError('');
        setSelectedCar(car);
    }

    async function confirmDelete() {
        if (!selectedCar) return;

        setIsDeleting(true);
        setDeleteError('');

        try {
            await deleteCar(selectedCar.id);

            setCars(currentCars =>
                currentCars.filter(car => car.id !== selectedCar.id)
            );

            removeFavorite(selectedCar.id);
            setSelectedCar(null);
        } catch (err) {
            setDeleteError(
                err instanceof Error
                    ? err.message
                    : 'Failed to delete car.'
            );
        } finally {
            setIsDeleting(false);
        }
    }

    const filteredCars = cars.filter(car => {
        const matchesSearch =
            `${car.brand} ${car.model}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesFavorites =
            !showFavoritesOnly || favoriteCarIds.includes(car.id);

        return matchesSearch && matchesFavorites;
    });

    if (loading) {
        return (
            <div className="page-container">
                <p className="page-message">Loading cars...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="page-error">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Samochody</h1>
                <p>Przeglądaj, wyszukuj i zarządzaj samochodami.</p>
            </div>

            <div className="cars-toolbar">
                <div className="cars-search">
                    <input
                        type="text"
                        placeholder="Szukaj według marki lub modelu..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <label className="favorites-filter">
                    <input
                        type="checkbox"
                        checked={showFavoritesOnly}
                        onChange={e =>
                            setShowFavoritesOnly(e.target.checked)
                        }
                    />
                    Pokaż tylko ulubione
                </label>
            </div>

            {cars.length === 0 ? (
                <p className="page-message">No cars found.</p>
            ) : filteredCars.length === 0 ? (
                <p className="page-message">
                    Nie znaleziono samochodów spełniających kryteria wyszukiwania.
                </p>
            ) : (
                <ul className="cars-list">
                    {filteredCars.map(car => (
                        <li className="car-card" key={car.id}>
                            <h2>
                                {car.brand} {car.model}
                            </h2>

                            <div className="car-card-actions">
                                <FavoriteButton
                                    isFavorite={favoriteCarIds.includes(car.id)}
                                    onClick={() => toggleFavorite(car.id)}
                                />

                                <Link
                                    to={`/cars/${car.id}`}
                                    className="details-button"
                                >
                                    Szczegóły
                                </Link>

                                <Link
                                    to={`/cars/${car.id}/edit`}
                                    className="edit-button"
                                >
                                    Edytuj
                                </Link>

                                <button
                                    type="button"
                                    className="delete-button"
                                    onClick={() => handleDeleteClick(car)}
                                >
                                    Usuń
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {selectedCar && (
                <div
                    className="delete-modal-overlay"
                    onClick={() => {
                        if (!isDeleting) {
                            setSelectedCar(null);
                            setDeleteError('');
                        }
                    }}
                >
                    <div
                        className="delete-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                        onClick={event => event.stopPropagation()}
                    >
                        <div className="delete-modal-icon">
                            <span>!</span>
                        </div>

                        <h2 id="delete-modal-title">
                            Czy na pewno chcesz usunąć samochód?
                        </h2>

                        <p className="delete-modal-description">
                            Czy na pewno chcesz usunąć samochód{' '}
                            <strong>
                                {selectedCar.brand} {selectedCar.model}
                            </strong>
                            ? Tej operacji nie można cofnąć.
                        </p>

                        {deleteError && (
                            <div className="delete-modal-error">
                                {deleteError}
                            </div>
                        )}

                        <div className="delete-modal-actions">
                            <button
                                type="button"
                                className="delete-modal-cancel"
                                disabled={isDeleting}
                                onClick={() => {
                                    setSelectedCar(null);
                                    setDeleteError('');
                                }}
                            >
                                Anuluj
                            </button>

                            <button
                                type="button"
                                className="delete-modal-confirm"
                                disabled={isDeleting}
                                onClick={confirmDelete}
                            >
                                {isDeleting ? 'Usuwanie...' : 'Usuń samochód'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
