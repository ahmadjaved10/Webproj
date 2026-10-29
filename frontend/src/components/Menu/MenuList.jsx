import React from 'react';
import MenuItem from './MenuItem';
import '../styles/components/menu.css';

const menuItems = [
  { id: 1, name: 'Salads', tag: 'Crisp & light', image: '/salads.jpg' },
  { id: 2, name: 'Entrees', tag: 'Chef specials', image: '/entrees.jpg' },
  { id: 3, name: 'Desserts', tag: 'Sweet endings', image: '/desserts.jpg' },
  { id: 4, name: 'Beverages', tag: 'Cold pressed', image: '/beverages.jpg' },
];

const MenuList = () => (
  <section className="menu-list">
    <div className="section-head">
      <span className="eyebrow">Our menu</span>
      <h2>Made fresh, every single day</h2>
      <p>Pick a category and dive into dishes crafted with seasonal ingredients.</p>
    </div>
    <div className="menu-items">
      {menuItems.map((item, index) => (
        <MenuItem key={item.id} item={item} index={index} />
      ))}
    </div>
  </section>
);

export default MenuList;