
import { useState } from 'react';
import { Link } from 'react-router';
import { authService } from '../services/authService';
import './Pages.css';

export default function RegisterPage() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Hasła nie są identyczne.');
            return;
        }

        setIsSubmitting(true);

        try {
            const message = await authService.register({
                userName,
                email,
                password
            });

            setSuccess(
                message || 'Konto zostało utworzone. Sprawdź swoją skrzynkę email, aby potwierdzić adres.'
            );

            setUserName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                'Nie udało się utworzyć konta.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Rejestracja</h1>
                <p>Utwórz nowe konto.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userName">Nazwa użytkownika</label>
                        <input
                            id="userName"
                            type="text"
                            value={userName}
                            onChange={(event) => setUserName(event.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="registerEmail">Email</label>
                        <input
                            id="registerEmail"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="registerPassword">Hasło</label>
                        <input
                            id="registerPassword"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Powtórz hasło</label>
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
                        {isSubmitting ? 'Rejestracja...' : 'Zarejestruj się'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        Masz już konto?{' '}
                        <Link to="/login">Zaloguj się</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
