import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../service/firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import { User } from '../../models/userTypes';

const AuthForm = () => {
    const [user, setUser] = useState<Pick<User, 'email' | 'password'>>({ email: '', password: '' });
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = useCallback(async () => {
        try {
            await signInWithEmailAndPassword(auth, user.email, user.password);
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.message);
        }
    }, [user.email, user.password]);

    const handleRegister = useCallback(async () => {
        try {
            await createUserWithEmailAndPassword(auth, user.email, user.password);
        } catch (error: any) {
            console.error('Registration error:', error);
            setError(error.message);
        }
    }, [user.email, user.password]);

    const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSignUp) {
            await handleRegister();
        } else {
            await handleLogin();
        }
    };

    return (
        <div className="container mt-5">
            <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={handleAuth} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">{isSignUp ? 'Register' : 'Login'}</button>
                <button type="button" className="btn btn-link" onClick={() => setIsSignUp(!isSignUp)}>
                    Switch to {isSignUp ? 'Login' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;
