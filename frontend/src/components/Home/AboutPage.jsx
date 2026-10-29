import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';

const AboutPage = () => (
  <>
    <main className="container page-shell">
      <section className="card p-4 p-md-5">
        <p className="text-uppercase fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
          Fresh food, thoughtfully made
        </p>
        <h1 className="mb-3">Good food brings people together.</h1>
        <p className="lead">
          Tasty &amp; Fresh is all about delicious meals made with fresh ingredients.
          Explore our menu and discover the dishes we love to share.
        </p>
        <div className="d-flex flex-wrap gap-2 mt-3">
          <Link to="/menu" className="btn btn-primary">Explore the menu</Link>
          <Link to="/gallery" className="btn btn-outline-success">View the gallery</Link>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default AboutPage;
