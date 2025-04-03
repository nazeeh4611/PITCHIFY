import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { baseurl } from '../../Constent/regex';
import { useGetToken } from '../../token/Gettoken';
import { useLocation } from 'react-router-dom';

interface PaymentFormProps {
  plan: {
    _id: string;
    planName: string;
    planPrice: number;
    Duration: number;
    description: string;
    features: string[];
    buttonText: string;
  };
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onPaymentSuccess?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ plan, setIsModalOpen, onPaymentSuccess }) => {
  const location = useLocation();
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur";
  const token = useGetToken(userType);
  const email = token?.email;
  const api = axios.create({
    baseURL: baseurl,
    headers: { "Content-Type": "application/json" },
  });
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);

    try {
      const response = await api.post(`/${userType}/create-payment-intent`, {
        amount: plan.planPrice * 100,
        currency: 'usd',
        duration: plan.Duration,
        id: plan._id,
        email,
      });

      const { clientSecret } = response.data;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement! },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        console.error(result.error);
      } else if (result.paymentIntent?.status === 'succeeded') {
        setIsModalOpen(false);
        
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError('An error occurred during payment. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-4">Checkout for {plan.planName}</h2>
      <p className="mb-4">Price: ${plan.planPrice} for {plan.Duration} {plan.Duration === 1 ? "Month" : "Months"}</p>
      
      <div className="mb-4">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-indigo-900 text-white px-6 py-2 rounded-md mt-4 hover:bg-indigo-800 disabled:opacity-50"
      >
        Pay ${plan.planPrice}
      </button>
    </form>
  );
};

export default PaymentForm;