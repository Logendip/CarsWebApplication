
import { useState } from 'react';
import { Link } from 'react-router';
import { authService } from '../services/authService';
import './Pages.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            await authService.forgotPassword(email);

            setSuccess(
                'Jeśli konto z podanym adresem email istnieje, otrzymasz wiadomość z linkiem do zmiany hasła.'
            );
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                'Nie udało się wysłać wiadomości.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Przypomnienie hasła</h1>
                <p>Podaj adres email przypisany do swojego konta.</p>

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

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Wysyłanie...' : 'Wyślij link'}
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/login">Powrót do logowania</Link>
                </div>
            </div>
        </div>
    );
}
