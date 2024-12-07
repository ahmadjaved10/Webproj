import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/suppliers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed', error);
      setError('An error occurred during login');
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
