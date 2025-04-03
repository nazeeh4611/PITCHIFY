import React from 'react';
import Slider from 'react-slick'; // Import react-slick
import "slick-carousel/slick/slick.css"; // Import slick styles
import "slick-carousel/slick/slick-theme.css"; // Import slick theme styles
import Navbar from '../Layout/Navbar';
import Presentation from "../Layout/Image/presentation.png";
import FutureCard1 from "../Layout/Image/Futurecard1.png";
import FutureCard2 from "../Layout/Image/Futurecard2.png";
import FutureCard3 from "../Layout/Image/Futurecard3.png";
import Getstart1 from "../Layout/Image/Getstart1.png";
import Getstart2 from "../Layout/Image/Getstart2.png";
import Getstart3 from "../Layout/Image/Getstart3.png";
import Getstart4 from "../Layout/Image/Getstart4.png";
import Testimon1 from "../Layout/Image/Testimon1.jpg";
import Testimon2 from "../Layout/Image/Testimon2.jpg";
import Testimon3 from "../Layout/Image/Testimon3.jpg";
import shortlogo from "../Layout/Image/shortlogo.png"
import {Link} from "react-router-dom";


import Footer from '../Layout/Footer';
import logo from "../Layout/Image/logo.jpeg";
import EntrepreneurModels from './EntrepreneurModels';
import { baseurl } from '../../Constent/regex';


interface FeatureCardProps {
  image: string; // Use image for each feature
  title: string;
}

interface TestimonialCardProps {
  image: string;
  name: string;
  role: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ image, title }) => (
  <div className="flex flex-col items-center p-4 text-center">
    <img 
      src={image} 
      alt={title} 
      className="w-60 h-60 mb-4"
    />
    <p className="text-sm font-medium">{title}</p>
  </div>
);

const TestimonialCard: React.FC<TestimonialCardProps> = ({ image, name, role }) => (
  <div className="bg-white p-6 rounded-lg">
    <img
      src={image}
      alt={name}
      className="w-44 h-52 rounded-full mx-auto mb-4"
    />
    <h3 className="text-lg font-semibold text-center">{name}</h3>
    <p className="text-gray-600 text-center text-sm">{role}</p>
    <p className="text-gray-500 text-sm text-center mt-2">
      "You've been everything I've needed. I'm blown away by how polished and professional this is."
    </p>
  </div>
);

const EntrepreneurHome: React.FC = () => {
    
  const settings = {
    dots: true, 
    infinite: true,
    speed: 500, 
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };



  return (
    <>
     <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/entrepreneur" },
          { label: "About Us", href: "/about-us" },
          {label:"Profile",href:"/entrepreneur/profile"}
        ]}
        homeRoute="/entrepreneur" 
      />    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Present Your Vision
              <span className="block text-gray-600">Empower Your Future</span>
            </h1>
            <p className="text-lg mb-6">
              Turn your innovative business ideas into reality by connecting with investors.
            </p>
            <div className="flex gap-4">
            <Link to="/entrepreneur/models">
              <button className="bg-indigo-900 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                Get Start
              </button>
              </Link>
              <Link to="/entrepreneur/investor-list">
              <button  className="border border-indigo-900 text-indigo-900 px-6 py-2 rounded-md hover:bg-indigo-50">
                Investor List
              </button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src={Presentation} 
              alt="Presentation Dashboard"
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Pitchify?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            image={FutureCard1}
            title="Easy pitch creation tools"
          />
          <FeatureCard
            image={FutureCard2} 
            title="Access to a global network of investors"
          />
          <FeatureCard
            image={FutureCard3}
            title="Personalized support and insights"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">How to Get Started?</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <FeatureCard
            image={Getstart1}
            title="Create an account"
          />
          <FeatureCard
            image={Getstart2}
            title="Build your pitch"
          />
          <FeatureCard
            image={Getstart3}
            title="Showcase your idea"
          />
          <FeatureCard
            image={Getstart4}
            title="Connect and get funded"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Success Stories from Our Community</h2>
        <Slider {...settings}>
          <TestimonialCard
            image={Testimon1}
            name="Sean Johnson"
            role="Founder of TechCo"
          />
          <TestimonialCard
            image={Testimon2}
            name="Mike Williams"
            role="CEO of StartUp"
          />
          <TestimonialCard
            image={Testimon3}
            name="David Brown"
            role="Founder of NextGen"
          />
        </Slider>
      </section>
    </div>
    <Footer/>
    </>

  );
};

export default EntrepreneurHome;
