
import { Link } from 'react-router';
import './Pages.css';

export default function HomePage() {
    return (
        <div className="page-container">
            <div className="home-content">
                <div className="page-header">
                    <h1>Witamy w aplikacji Cars</h1>
                    <p>
                        Zarządzaj swoją kolekcją samochodów w jednym miejscu.
                    </p>
                </div>

                <p>
                    Aplikacja umożliwia zarządzanie samochodami.
                    Możesz przeglądać listę samochodów, sprawdzać ich
                    szczegóły, dodawać nowe samochody oraz edytować
                    i usuwać istniejące.
                </p>

                <div className="home-actions">
                    <Link to="/cars" className="page-button">
                        Przeglądaj samochody
                    </Link>

                    <Link to="/cars/create" className="page-button secondary">
                        Dodaj samochód
                    </Link>
                </div>
            </div>
        </div>
    );
}
