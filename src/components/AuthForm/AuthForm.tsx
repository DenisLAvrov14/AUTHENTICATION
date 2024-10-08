import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Credentials, AuthError } from '../../models/userTypes';
import { auth } from '../../service/firebaseConfig'; 
import styles from './AuthForm.module.css'; 

const AuthForm = () => {
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = useCallback(async () => {
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      console.log("User logged in");
      navigate('/users'); 
    } catch (err) {
      const error = err as AuthError;
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('User not found. Please register.');
      } else {
        setError(error.message); 
      }
    }
  }, [credentials, navigate]);

  const handleRegister = useCallback(async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      console.log("User registered", userCredential.user);
      navigate('/users');
    } catch (err) {
      const error = err as AuthError;
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else {
        setError(error.message);
      }
    }
  }, [credentials, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSignUp) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles['form-container']}>
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
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
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isSignUp ? 'Register' : 'Login'}
          </button>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            Switch to {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
