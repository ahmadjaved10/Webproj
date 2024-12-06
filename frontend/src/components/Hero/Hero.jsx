import React from 'react';
import Button from '../Shared/Button';
import '../styles/components/hero.css';

const Hero = () => {
 return (
   <section className="hero">
     <div className="hero-content">
       <h1>Welcome to the world of Teaty & Fresh Food</h1>
       <p>Discover our delicious and healthy meals</p>
       <div className="search-bar">
         <input type="text" placeholder="Search for recipes, ingredients, etc." />
         <Button>Search</Button>
       </div>
     </div>
   </section>
 );
};

export default Hero;