import React from 'react';
import GalleryItem from './GalleryItem';
import '../styles/components/gallery.css';

const GalleryList = () => {
 const galleryItems = [
   { id: 1, image: '' },
   { id: 2, image: './logo192.png' },
   { id: 3, image: '/dish3.jpg' },
   { id: 4, image: '/dish4.jpg' },
   { id: 5, image: '/dish5.jpg' },
   { id: 6, image: '/dish6.jpg' }
 ];

 return (
   <section className="gallery-list">
     <h2>Check out our delicious dishes</h2>
     <div className="gallery-items">
       {galleryItems.map((item) => (
         <GalleryItem key={item.id} item={item} />
       ))}
     </div>
   </section>
 );
};

export default GalleryList;