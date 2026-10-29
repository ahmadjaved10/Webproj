import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/components/login.css';
import API from '../services/api';
import { saveSession } from '../Shared/session';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await API.post('/suppliers/login', { email, password });
      saveSession(data);
      navigate(location.state?.from?.pathname || location.state?.from || '/', { replace: true });
    } catch (error) {
      console.error('Login failed', error);
      setError(error.response?.data?.message || 'An error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <div id="radius-shape-1"></div>
      <div id="radius-shape-2"></div>
      <div className="card">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleLogin}>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn w-100">Login</button>
        </form>
        <p className="register-login-link text-center mt-4 mb-0">
          New supplier? <Link to="/register">Create an account</Link>
        </p>
        <div className="text-center mt-4">
          <p>Or login with</p>
          <div className="social-login">
            <button className="btn"><i className="fab fa-facebook-f"></i></button>
            <button className="btn"><i className="fab fa-twitter"></i></button>
            <button className="btn"><i className="fab fa-google"></i></button>
            <button className="btn"><i className="fab fa-github"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
