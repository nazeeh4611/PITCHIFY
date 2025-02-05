import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import logo from "../Layout/Image/logo.jpeg";
import shortlogo from "../Layout/Image/shortlogo.png";
import Footer from "../Layout/Footer";
import PaymentForm from "../Common/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { baseurl } from "../../Constent/regex";
import { useGetToken } from "../../token/Gettoken";

// Load Stripe key using environment variables
const stripePromise = loadStripe("pk_test_51QfxvoLZd98lJL6B6lPy5NrC38ms6TqA7OuEUeXaIKEo72Yug3erw2nmgsCMHpA4uzFPzzKGHmsHc9SD1Li1pbNT00V0KNSA2O");

interface PlanFeature {
  feature: string;
  included: boolean;
}

interface PricingPlan {
  _id: string;
  planName: string;
  planPrice: number;
  Duration: number;
  description: string;
  features: string[];
  buttonText: string;
}

const PricingPage: React.FC = () => {
  const token = useGetToken("investor");
  const email = token?.email;
  const api = axios.create({
    baseURL: baseurl,
  });

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investorData, setInvestorData] = useState<any>(null);
  const plansRef = useRef<HTMLDivElement>(null);

  // Comparison features data
  const comparisonFeatures = [
    {
      feature: "Unlimited models available to view",
      free: false,
      premium: true
    },
    {
      feature: "Advanced filters and search options",
      free: false,
      premium: true
    },
    {
      feature: "Access to exclusive, high-value models",
      free: false,
      premium: true
    },
    {
      feature: "Priority customer support",
      free: false,
      premium: true
    }
  ];

  const CheckIcon = () => (
    <svg className="w-5 h-5 text-indigo-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const DashIcon = () => (
    <div className="w-5 h-0.5 bg-gray-300"></div>
  );

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const GetInvestor = async () => {
    try {
      const response = await api.post("/investor/profile", { email });
      const investor = response.data.investor.Investor;
      const premiumPlan = investor?.premium.plan.planName;
      setInvestorData(premiumPlan);
    } catch (error) {
      console.error("Error fetching investor data:", error);
    }
  };

  const getPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/investor/get-plan");
      setPlans(response.data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Failed to load plans. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  useEffect(() => {
    getPlans();
    GetInvestor();
  }, []);

  const hasPremium = investorData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={getPlans}
            className="bg-indigo-900 text-white px-6 py-2 rounded-md hover:bg-indigo-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/investor" },
          { label: "About Us", href: "/about-us" },
        ]}
      />
      <div className="min-h-screen bg-white p-4 md:p-8 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Unlock Unlimited Opportunities.</h1>
          <p className="text-gray-600 mb-4">Try Premium for Just $52 for 3 Months!</p>
          <div className="flex justify-center gap-4">
            {plans.length > 0 && (
              <button
                onClick={() => handleOpenModal(plans[0])}
                className="bg-indigo-900 text-white px-6 py-2 rounded-md hover:bg-indigo-800 transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Premium
              </button>
            )}
            <button
              onClick={scrollToPlans}
              className="border border-indigo-900 text-indigo-900 px-6 py-2 rounded-md hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              View All Plans
            </button>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="max-w-4xl mx-auto my-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Experience the difference</h2>
            <p className="text-lg text-gray-600">"Go Premium and Take Full Control of Your Success!"</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 border-b">
              <div className="p-4 font-semibold">What you'll get</div>
              <div className="p-4 font-semibold text-center border-x">Pitchify's free plan</div>
              <div className="p-4 font-semibold text-center">Pitchify's premium plan</div>
            </div>

            {comparisonFeatures.map((item, index) => (
              <div key={index} className="grid grid-cols-3 border-b last:border-b-0">
                <div className="p-4">{item.feature}</div>
                <div className="p-4 flex justify-center items-center border-x">
                  {item.free ? <CheckIcon /> : <DashIcon />}
                </div>
                <div className="p-4 flex justify-center items-center">
                  {item.premium ? <CheckIcon /> : <DashIcon />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={plansRef} className="max-w-6xl mx-auto mb-24">
          <h2 className="text-2xl font-bold text-center mb-8">Flexible Plans for Every Ambition</h2>
          {plans.length === 0 ? (
            <p className="text-center text-gray-600">No plans available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-6 flex flex-col bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-indigo-900"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4">
                      <img src={shortlogo} alt="Logo" />
                    </div>
                    <span className="font-semibold">Premium</span>
                  </div>
                  <div className="font-bold mb-2">{plan.planName}</div>
                  <div className="text-2xl font-bold mb-2">
                    ${plan.planPrice} <span className="text-sm">for {plan.Duration} {plan.Duration === 1 ? "Month" : "Months"}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{plan.description}</div>
                  <ul className="mb-6 flex-grow">
                    {plan.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-indigo-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleOpenModal(plan)}
                    className={`w-full py-2 rounded-md transition-colors duration-300 transform ${
                      hasPremium && hasPremium === plan.planName
                        ? "bg-white text-indigo-900 border border-indigo-900 hover:bg-indigo-50"
                        : "bg-indigo-900 text-white hover:bg-indigo-800"
                    }`}
                  >
                    {hasPremium && hasPremium === plan.planName ? "View Details" : "Get Premium"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {isModalOpen && selectedPlan && (
          <div
            className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleCloseModal}
            aria-hidden="true"
          >
            <div
              className="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                &times;
              </button>
              <h2 className="text-lg font-bold mb-4 text-center">
                Complete Your Payment for {selectedPlan.planName} Plan
              </h2>
              <Elements stripe={stripePromise}>
                <PaymentForm plan={selectedPlan} setIsModalOpen={setIsModalOpen} />
              </Elements>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default PricingPage;