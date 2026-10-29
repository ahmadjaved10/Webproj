import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { saveSession } from '../Shared/session';
import '../styles/components/login.css';
import '../styles/components/admin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const { data } = await API.post('/admin/login', { email, password });
      saveSession(data);
      navigate('/admin', { replace: true });
    } catch (requestError) {
      console.error('Admin login failed', requestError);
      setError(requestError.response?.data?.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-container admin-auth">
      <section className="card">
        <p className="admin-eyebrow">Restricted access</p>
        <h2>Administrator sign in</h2>
        {error && <div className="error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" className="form-control" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" className="form-control" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button type="submit" className="btn" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </section>
    </main>
  );
};

export default AdminLogin;
