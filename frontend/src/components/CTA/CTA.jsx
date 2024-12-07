import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Shared/Button';
import '../styles/components/cta.css';

const CTA = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <section className="cta">
      <h2>Ready to try our fresh, delicious food?</h2>
      <p>Sign up now and get 20% off your first order!</p>
      <Button onClick={handleSignUp}>Sign Up</Button>
    </section>
  );
};

export default CTA;
