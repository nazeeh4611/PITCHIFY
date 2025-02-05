import React from 'react'; // Add this import
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { loadStripe } from '@stripe/stripe-js';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';

const stripePromise = loadStripe('pk_test_51QfxvoLZd98lJL6B6lPy5NrC38ms6TqA7OuEUeXaIKEo72Yug3erw2nmgsCMHpA4uzFPzzKGHmsHc9SD1Li1pbNT00V0KNSA2O'); // Your Stripe Publishable Key

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster/>
    <App />
  </StrictMode>,
);
