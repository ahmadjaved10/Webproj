import React from 'react';
import MenuItem from './MenuItem';
import '../styles/components/menu.css';

const MenuList = () => {
 const menuItems = [
   { id: 1, name: 'Salads', image: '/salads.jpg' },
   { id: 2, name: 'Entrees', image: '/entrees.jpg' },
   { id: 3, name: 'Desserts', image: '/desserts.jpg' },
   { id: 4, name: 'Beverages', image: '/beverages.jpg' }
 ];

 return (
   <section className="menu-list">
     <h2>Our Menu</h2>
     <div className="menu-items">
       {menuItems.map((item) => (
         <MenuItem key={item.id} item={item} />
       ))}
     </div>
   </section>
 );
};

export default MenuList;