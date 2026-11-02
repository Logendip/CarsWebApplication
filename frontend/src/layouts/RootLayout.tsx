
import { NavLink, Outlet } from 'react-router';

export default function RootLayout() {
    return (
        <>
            <nav className="navbar">
                <NavLink to="/" end>
                    Strona główna
                </NavLink>

                <NavLink to="/cars">
                    Samochody
                </NavLink>

                <NavLink to="/cars/new">
                    Dodaj samochód
                </NavLink>
            </nav>

            <main className="container">
                <Outlet />
            </main>
        </>
    );
}
