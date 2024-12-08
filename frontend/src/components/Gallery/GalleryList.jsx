import React from 'react';
import GalleryItem from './GalleryItem';
import '../styles/components/gallery.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const GalleryList = () => {
  const galleryItems = [
    { id: 1, image: './logo192.png' },
    { id: 2, image: '/dish3.jpg' },
    { id: 3, image: '/dish4.jpg' },
    { id: 4, image: '/dish5.jpg' },
    { id: 5, image: '/dish6.jpg' }
  ];

  return (
    <section className="gallery-list container mt-4">
      <h2 className="text-center mb-4">Check out our delicious dishes</h2>
      <div className="row">
        {galleryItems.map((item) => (
          <div key={item.id} className="col-md-4 mb-3">
            <GalleryItem item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryList;