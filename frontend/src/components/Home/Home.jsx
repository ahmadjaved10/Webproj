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
      <MenuList />
      <GalleryList />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;