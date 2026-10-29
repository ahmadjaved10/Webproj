import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { saveSession } from '../Shared/session';
import '../styles/components/login.css';
import '../styles/components/customer.css';

const CustomerRegister = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await API.post('/customers/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        password: form.password,
      });
      saveSession(data);
      navigate('/shop', { replace: true });
    } catch (requestError) {
      console.error('Customer registration failed', requestError);
      setError(requestError.response?.data?.message || 'Unable to create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-container customer-auth">
      <section className="card">
        <h2>Create a customer account</h2>
        {error && <div className="error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="customer-name">Name</label>
          <input id="customer-name" name="name" className="form-control" autoComplete="name" value={form.name} onChange={handleChange} required />
          <label htmlFor="customer-email">Email</label>
          <input id="customer-email" name="email" type="email" className="form-control" autoComplete="email" value={form.email} onChange={handleChange} required />
          <label htmlFor="customer-phone">Phone (optional)</label>
          <input id="customer-phone" name="phone" type="tel" className="form-control" autoComplete="tel" value={form.phone} onChange={handleChange} />
          <label htmlFor="customer-address">Pickup/delivery address</label>
          <textarea id="customer-address" name="address" className="form-control" autoComplete="street-address" value={form.address} onChange={handleChange} rows="2" />
          <label htmlFor="customer-new-password">Password</label>
          <input id="customer-new-password" name="password" type="password" className="form-control" autoComplete="new-password" minLength="8" value={form.password} onChange={handleChange} required />
          <label htmlFor="customer-confirm-password">Confirm password</label>
          <input id="customer-confirm-password" name="confirmPassword" type="password" className="form-control" autoComplete="new-password" minLength="8" value={form.confirmPassword} onChange={handleChange} required />
          <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="register-login-link text-center mt-4 mb-0">
          Already registered? <Link to="/customer/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default CustomerRegister;
