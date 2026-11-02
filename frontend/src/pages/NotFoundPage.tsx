
import { Link } from 'react-router';

export default function NotFoundPage() {
    return (
        <div>
            <h1>404 - Nie znaleziono strony</h1>

            <p>
                Podany adres nie istnieje.
            </p>

            <Link to="/">
                Powrót do strony głównej
            </Link>
        </div>
    );
}
