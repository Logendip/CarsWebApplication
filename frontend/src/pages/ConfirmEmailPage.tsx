
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { authService } from '../services/authService';
import './Pages.css';

export default function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();

    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    const [message, setMessage] = useState('Potwierdzanie adresu email...');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!userId || !token) {
            setMessage('Nieprawidłowy link potwierdzający.');
            return;
        }

        let cancelled = false;

        const confirmEmail = async () => {
            try {
                await authService.confirmEmail(userId, token);

                if (!cancelled) {
                    setMessage('Adres email został pomyślnie potwierdzony.');
                    setIsSuccess(true);
                }
            } catch {
                if (!cancelled) {
                    setMessage('Nie udało się potwierdzić adresu email. Link może być nieprawidłowy lub wygasł.');
                }
            }
        };

        confirmEmail();

        return () => {
            cancelled = true;
        };
    }, [userId, token]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Potwierdzenie email</h1>

                <p>{message}</p>

                {isSuccess && (
                    <Link to="/login" className="btn btn-primary">
                        Przejdź do logowania
                    </Link>
                )}

                {!isSuccess && (
                    <Link to="/login">Powrót do logowania</Link>
                )}
            </div>
        </div>
    );
}
