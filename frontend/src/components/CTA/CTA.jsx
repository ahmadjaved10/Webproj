import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Shared/Button';
import '../styles/components/cta.css';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-wrap">
      <div className="cta">
        <div className="cta-badge" aria-hidden="true">20%<small>OFF</small></div>
        <div className="cta-copy">
          <span className="cta-pill">Limited offer</span>
          <h2>Ready to try our fresh, delicious food?</h2>
          <p>Sign up now and get 20% off your first order!</p>
        </div>
        <Button onClick={() => navigate('/login')}>Sign Up</Button>
      </div>
    </section>
  );
};

export default CTA;