import React from 'react';
import Button from '../Shared/Button';
import '../styles/components/hero.css';

const Hero = () => (
  <section className="hero">
    <div className="hero-copy">
      <span className="hero-pill"><i className="hero-dot" /> Fresh meals, delivered daily</span>
      <h1>Eat <em>fresh.</em><br />Feel <em>fantastic.</em></h1>
      <p>Chef-crafted, healthy dishes made from the best seasonal ingredients, at your door in minutes.</p>

      <form className="hero-search" role="search" onSubmit={(e) => e.preventDefault()}>
        <svg className="hero-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input type="search" placeholder="Search recipes, ingredients..." aria-label="Search" />
        <Button>Search</Button>
      </form>

      <ul className="hero-stats">
        <li><strong>4.9★</strong><span>Avg. rating</span></li>
        <li><strong>25 min</strong><span>Delivery</span></li>
        <li><strong>120+</strong><span>Fresh dishes</span></li>
      </ul>
    </div>

    <div className="hero-visual" aria-hidden="true">
      <img className="hero-photo" src="/dish3.jpg" alt="" width="640" height="800" fetchpriority="high" />
      <img className="hero-photo-sm" src="/entrees.jpg" alt="" width="240" height="240" />
      <div className="hero-chip hero-chip--rating"><strong>4.9</strong><span>★★★★★ · 2k+ reviews</span></div>
      <div className="hero-chip hero-chip--time"><strong>25 min</strong><span>Avg. delivery</span></div>
    </div>
  </section>
);

export default Hero;