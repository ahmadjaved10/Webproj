import React from 'react';
import Button from '../Shared/Button';
import '../styles/components/hero.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Hero = () => {
 return (
   <section className="hero bg-primary text-white text-center py-5">
     <div className="hero-content">
       <h1>Welcome to the world of Teaty & Fresh Food</h1>
       <p>Discover our delicious and healthy meals</p>
       <div className="search-bar mt-3">
         <input type="text" placeholder="Search for recipes, ingredients, etc." className="form-control d-inline-block w-50" />
         <Button>Search</Button>
       </div>
     </div>
   </section>
 );
};

export default Hero;