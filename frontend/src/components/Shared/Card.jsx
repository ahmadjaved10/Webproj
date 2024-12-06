import React from 'react';
import '../styles/components/card.css';

const Card = ({ children }) => {
 return (
   <div className="card">
     {children}
   </div>
 );
};

export default Card;