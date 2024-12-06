import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../Shared/Card';
import '../styles/components/menu.css';

const MenuItem = ({ item }) => {
 return (
   <Link to={`/menu/${item.id}`} className="menu-item">
     <Card>
       <img src={item.image} alt={item.name} />
       <h3>{item.name}</h3>
     </Card>
   </Link>
 );
};

export default MenuItem;