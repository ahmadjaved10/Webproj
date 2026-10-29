import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/menu.css';

const MenuItem = ({ item, index = 0 }) => (
  <Link to={`/menu/${item.id}`} className="menu-item fade-up" style={{ '--i': index }}>
    <figure className="menu-media">
      <img src={item.image} alt={item.name} width="480" height="600" loading="lazy" />
    </figure>
    <div className="menu-overlay">
      <span className="menu-tag">{item.tag}</span>
      <h3>{item.name}</h3>
      <span className="menu-go">Explore <b>→</b></span>
    </div>
  </Link>
);

export default MenuItem;