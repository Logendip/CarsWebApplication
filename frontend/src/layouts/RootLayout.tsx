import { NavLink, Outlet } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';

export default function RootLayout() {
    const setShowFavoritesOnly = useCarUiStore(
        state => state.setShowFavoritesOnly
    );

    return (
        <>
            <header className="navbar">
                <div className="navbar-content">
                    <NavLink to="/" end className="navbar-brand">
                        <span className="navbar-logo">C</span>
                        <span>Cars</span>
                    </NavLink>

                    <nav className="navbar-links">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                isActive ? 'navbar-link active' : 'navbar-link'
                            }
                        >
                            Strona główna
                        </NavLink>

                        <NavLink
                            to="/cars"
                            end
                            onClick={() => setShowFavoritesOnly(false)}
                            className={({ isActive }) =>
                                isActive ? 'navbar-link active' : 'navbar-link'
                            }
                        >
                            Samochody
                        </NavLink>

                        <NavLink
                            to="/cars/new"
                            end
                            className={({ isActive }) =>
                                isActive ? 'navbar-link active' : 'navbar-link'
                            }
                        >
                            Dodaj samochód
                        </NavLink>
                    </nav>
                </div>
            </header>

            <main className="container">
                <Outlet />
            </main>
        </>
    );
}