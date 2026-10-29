import React from 'react';
import '../styles/components/foodcard.css';

const FoodCard = ({ name, description, price, image, rating = 4.8, onAdd }) => (
  <article className="food-card">
    <div className="food-card__media">
      <img src={image} alt={name} loading="lazy" />
      <span className="food-card__rating">★ {rating}</span>
    </div>
    <div className="food-card__body">
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="food-card__footer">
        <span className="food-card__price">${price}</span>
      </div>
    </div>
    <button className="food-card__add" onClick={onAdd}>Add to Cart</button>
  </article>
);

export default FoodCard;