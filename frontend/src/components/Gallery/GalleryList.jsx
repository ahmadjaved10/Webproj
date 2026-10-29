import React from 'react';
import GalleryItem from './GalleryItem';
import '../styles/components/gallery.css';

const galleryItems = [
  { id: 1, image: './logo192.png' },
  { id: 2, image: '/dish3.jpg' },
  { id: 3, image: '/dish4.jpg' },
  { id: 4, image: '/dish5.jpg' },
  { id: 5, image: '/dish6.jpg' },
];

const GalleryList = () => (
  <section className="gallery-list">
    <div className="section-head">
      <span className="eyebrow">Gallery</span>
      <h2>Check out our delicious dishes</h2>
      <p>A little taste of what comes out of our kitchen every day.</p>
    </div>
    <div className="gallery-grid">
      {galleryItems.map((item, index) => (
        <GalleryItem key={item.id} item={item} index={index} />
      ))}
    </div>
  </section>
);

export default GalleryList;