import React from 'react';
import Card from '../Shared/Card';
import '../styles/components/gallery.css';

const GalleryItem = ({ item }) => {
 return (
   <div className="gallery-item">
     <Card>
       <img src={item.image} alt={`Dish ${item.id}`} />
     </Card>
   </div>
 );
};

export default GalleryItem;