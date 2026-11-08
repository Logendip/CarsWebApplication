import { Heart } from 'lucide-react';
import './FavoriteButton.css';

interface FavoriteButtonProps {
    isFavorite: boolean;
    onClick: () => void;
}

export default function FavoriteButton({
    isFavorite,
    onClick
}: FavoriteButtonProps) {
    return (
        <button
            type="button"
            className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
            onClick={onClick}
            aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
        >
            <Heart
                className="favorite-icon"
                size={23}
                strokeWidth={2}
                fill={isFavorite ? 'currentColor' : 'none'}
            />
        </button>
    );
}