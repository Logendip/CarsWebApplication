
import { Link } from 'react-router';
import './Pages.css';

export default function NotFoundPage() {
    return (
        <div className="page-container">
            <div className="not-found-content">
                <p className="not-found-code">404</p>

                <h1>Nie znaleziono strony</h1>

                <p>
                    Podany adres nie istnieje lub strona została przeniesiona.
                </p>

                <Link to="/" className="page-button">
                    Powrót do strony głównej
                </Link>
            </div>
        </div>
    );
}
