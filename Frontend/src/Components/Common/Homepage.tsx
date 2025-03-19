import React from 'react';
import Navbar from '../Layout/Navbar';

import logo from '../Layout/Image/logo.jpeg';
import shortlogo from "../Layout/Image/shortlogo.png"
import Hero from '../Layout/Hero';
import Footer from '../Layout/Footer';
import Register from './Register';
import PremiumCard from './Subscription';


function Homepage() {
  return (
    <>
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: 'Home', href: '/' },
          { label: 'Explore Premium', href: '/select' },
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

