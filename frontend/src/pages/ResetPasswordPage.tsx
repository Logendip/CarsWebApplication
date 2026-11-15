
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { authService } from '../services/authService';
import './Pages.css';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!email || !token) {
            setError('Nieprawidłowy link do zmiany hasła.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Hasła nie są identyczne.');
            return;
        }

        setIsSubmitting(true);

        try {
            await authService.resetPassword(email, token, newPassword);

            setSuccess('Hasło zostało pomyślnie zmienione.');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                'Nie udało się zmienić hasła. Link może być nieprawidłowy lub wygasł.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!email || !token) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Zmiana hasła</h1>
                    <p>Nieprawidłowy link do zmiany hasła.</p>
                    <Link to="/forgot-password">Wyślij nowy link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Zmiana hasła</h1>
                <p>Wprowadź nowe hasło.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="newPassword">Nowe hasło</label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Powtórz nowe hasło</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Zapisywanie...' : 'Zmień hasło'}
                    </button>
                </form>

                {success && (
                    <div className="auth-links">
                        <Link to="/login">Przejdź do logowania</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
