
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import './Pages.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError('');
        setIsSubmitting(true);

        try {
            const user = await authService.login({
                email,
                password
            });

            setUser(user);
            navigate('/cars');
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                'Nieprawidłowy email lub hasło.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Logowanie</h1>
                <p>Zaloguj się na swoje konto.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Hasło</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/forgot-password">
                        Nie pamiętasz hasła?
                    </Link>

                    <p>
                        Nie masz konta?{' '}
                        <Link to="/register">Zarejestruj się</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
