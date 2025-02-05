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
}

const PaymentForm: React.FC<PaymentFormProps> = ({ plan, setIsModalOpen }) => {
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

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [subscribedPlan, setSubscribedPlan] = useState(plan);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        console.error(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        setPaymentSuccess(true);
        setIsModalOpen(false); 
        setSubscribedPlan(plan);  
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-4">Checkout for {plan.planName}</h2>
      <p className="mb-4">Price: ${plan.planPrice} for {plan.Duration} {plan.Duration === 1 ? "Month" : "Months"}</p>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe}
        className="bg-indigo-900 text-white px-6 py-2 rounded-md mt-4 hover:bg-indigo-800"
      >
        Pay ${plan.planPrice}
      </button>

      {paymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-green-500 text-white p-4 rounded-lg">
            <p>Payment succeeded for {subscribedPlan.planName}!</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default PaymentForm;



