import React from 'react';
import Button from '../Shared/Button';
import '../styles/components/cta.css';

const CTA = () => {
 return (
   <section className="cta">
     <h2>Ready to try our fresh, delicious food?</h2>
     <p>Sign up now and get 20% off your first order!</p>
     <Button>Sign Up</Button>
   </section>
 );
};

export default CTA;