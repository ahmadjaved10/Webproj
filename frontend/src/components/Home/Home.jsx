import React from 'react';
import Header from '../Header/Header';
import Hero from '../Hero/Hero';
import MenuList from '../Menu/MenuList';
import GalleryList from '../Gallery/GalleryList';
import CTA from '../CTA/CTA';
import Footer from '../Footer/Footer';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      {/* Assuming MenuList is styled appropriately */}
      <MenuList />
      {/* Assuming GalleryList is styled appropriately */}
      <GalleryList />
      {/* Assuming CTA is styled appropriately */}
      <CTA />
      {/* Footer styled with Bootstrap */}
      <Footer />
    </div>
  );
};

export default Home;