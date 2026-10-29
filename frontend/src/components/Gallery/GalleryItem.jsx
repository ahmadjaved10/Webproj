import React from 'react';
import '../styles/components/gallery.css';

const GalleryItem = ({ item, index = 0 }) => (
  <figure className="gallery-item fade-up" style={{ '--i': index }}>
    <img src={item.image} alt={`Dish ${item.id}`} width="800" height="600" loading="lazy" />
    <figcaption>Dish {String(item.id).padStart(2, '0')}</figcaption>
  </figure>
);

export default GalleryItem;