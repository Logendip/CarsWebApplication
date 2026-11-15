
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';

export default function RootLayout() {
    const navigate = useNavigate();

    const setShowFavoritesOnly = useCarUiStore(
        state => state.setShowFavoritesOnly
    );

    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    const handleLogout = () => {
        logout();
        setShowFavoritesOnly(false);
        navigate('/login');
    };

    const isAdmin = user?.roles?.includes('Admin') ?? false;

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
                            to="/about"
                            className={({ isActive }) =>
                                isActive ? 'navbar-link active' : 'navbar-link'
                            }
                        >
                            O aplikacji
                        </NavLink>

                        {user && (
                            <>
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
                                    className={({ isActive }) =>
                                        isActive ? 'navbar-link active' : 'navbar-link'
                                    }
                                >
                                    Dodaj samochód
                                </NavLink>
                            </>
                        )}
                    </nav>

                    <nav className="navbar-links">
                        {user ? (
                            <>
                                <span className="navbar-link">
                                    {user.userName}
                                    {isAdmin && ' (Admin)'}
                                </span>

                                <button
                                    type="button"
                                    className="navbar-link"
                                    onClick={handleLogout}
                                >
                                    Wyloguj się
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        isActive ? 'navbar-link active' : 'navbar-link'
                                    }
                                >
                                    Logowanie
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    className={({ isActive }) =>
                                        isActive ? 'navbar-link active' : 'navbar-link'
                                    }
                                >
                                    Rejestracja
                                </NavLink>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="container">
                <Outlet />
            </main>
        </>
    );
}
