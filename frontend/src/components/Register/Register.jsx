import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/login.css';
import '../styles/components/register.css';
import API from '../services/api';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await API.post('/suppliers/register', {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
      });
      setSubmitted(true);
    } catch (registrationError) {
      console.error('Registration failed', registrationError);
      setError(registrationError.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container register-container">
      <div id="radius-shape-1" aria-hidden="true"></div>
      <div id="radius-shape-2" aria-hidden="true"></div>
      <section className="card" aria-labelledby="register-title">
        <h2 id="register-title">Create your supplier account</h2>
        <p className="text-center">Join Tasty &amp; Fresh to manage your business.</p>
        {submitted ? (
          <div role="status">
            <p>Your supplier application has been submitted and is waiting for admin approval.</p>
            <p>You can sign in after an admin approves your account.</p>
            <p className="register-login-link text-center mt-4 mb-0">
              <Link to="/login">Go to supplier sign in</Link>
            </p>
          </div>
        ) : (
          <>
        {error && <div className="error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />

          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="phone" className="form-label">Phone (optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-control"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
          />

          <label htmlFor="address" className="form-label">Business address (optional)</label>
          <input
            type="text"
            id="address"
            name="address"
            className="form-control"
            value={form.address}
            onChange={handleChange}
            autoComplete="street-address"
          />

          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <button type="submit" className="btn w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="register-login-link text-center mt-4 mb-0">
          Already registered? <Link to="/login">Supplier login</Link>
        </p>
          </>
        )}
      </section>
    </div>
  );
};

export default Register;
