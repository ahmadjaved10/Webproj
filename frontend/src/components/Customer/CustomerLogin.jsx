import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { saveSession } from '../Shared/session';
import '../styles/components/login.css';
import '../styles/components/customer.css';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const { data } = await API.post('/customers/login', { email, password });
      saveSession(data);
      navigate(location.state?.from?.pathname || '/customer/orders', { replace: true });
    } catch (requestError) {
      console.error('Customer login failed', requestError);
      setError(requestError.response?.data?.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-container customer-auth">
      <section className="card">
        <h2>Customer sign in</h2>
        {error && <div className="error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="customer-login-email">Email</label>
          <input id="customer-login-email" className="form-control" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="customer-login-password">Password</label>
          <input id="customer-login-password" className="form-control" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="register-login-link text-center mt-4 mb-0">
          New here? <Link to="/customer/register">Create a customer account</Link>
        </p>
      </section>
    </main>
  );
};

export default CustomerLogin;
