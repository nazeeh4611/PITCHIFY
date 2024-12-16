import React from 'react';
import Navbar from '../Layout/Navbar';

import logo from '../Layout/Image/logo.jpeg';
import Hero from '../Layout/Hero';
import Footer from '../Layout/Footer';
import Register from './Register';


function Homepage() {
  return (
    <>
      <Navbar
        logoUrl={logo}
        links={[
          { label: 'Home', href: '/' },
          { label: 'Explore Premium', href: '/explore-premium' },
          { label: 'About Us', href: '/about-us' },
          { label: 'Login', href: '/select' },
        ]}
      />
      <Hero/>
      <Footer/>

    </>
  );
}

export default Homepage;

