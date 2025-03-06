import React, { useEffect, useState } from 'react';
import Sidebar from './InvestorSidebar';
import logo from "../Layout/Image/logo.jpeg";
import Navbar from '../Layout/Navbar';
import shortlogo from "../Layout/Image/shortlogo.png";
import { useNavigate } from 'react-router-dom';
import SubscriptionDetails from './InvestoPlandetails';
import { useGetToken } from '../../token/Gettoken';
import axios from 'axios';
import { baseurl } from '../../Constent/regex';
import { Menu, X } from 'lucide-react';

const SkeletonLoader = () => (
  <div className="animate-pulse flex flex-col items-center w-full max-w-xs">
    <div className="bg-gray-200 rounded-xl w-full p-6">
      <div className="bg-gray-300 p-4 rounded-lg">
        <div className="h-6 bg-gray-400 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-400 rounded w-1/4 mb-4"></div>
        <div className="h-8 bg-gray-400 rounded w-2/3 mb-6"></div>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="h-4 bg-gray-400 rounded w-full"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 bg-gray-400 rounded w-full"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 bg-gray-400 rounded w-full"></div>
          </div>
        </div>
      </div>
      <div className="mt-4 h-10 bg-gray-300 rounded-lg w-full"></div>
    </div>
  </div>
);

const InvestorSubscription = () => {
  const token = useGetToken("investor");
  const email = token?.email;
  const api = axios.create({
    baseURL: baseurl,
  });
  const navigate = useNavigate();
  const [investorData, setInvestorData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handlepremium = async () => {
    try {
      navigate('/investor/plan-details');
    } catch (error) {
      console.error('Error during navigation:', error);
    }
  };

  const GetInvestor = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/investor/profile", { email });
      const investor = response.data.investor.Investor;

      const premiumPlan = investor?.premium.plan || {};
      const start = investor?.premium.startDate || "";
      const end = investor?.premium.endDate || "";

      setInvestorData(premiumPlan);
      setStartDate(start);
      setEndDate(end);
    } catch (error) {
      console.error("Error fetching investor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetInvestor();
    
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [email]);

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
      <div className="flex-1 flex justify-center items-center bg-gray-100 p-2 sm:p-4 min-h-screen">
        <div
          className="bg-white rounded-[2%] shadow-lg p-1 sm:p-2 md:p-4 flex flex-col md:flex-row w-full max-w-full sm:max-w-full md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "80vh",
          }}
        >
          <div className="md:hidden absolute top-2 left-2 z-20">
            <button 
              onClick={toggleSidebar}
              className="p-2 text-[#1e1b4b] rounded-lg hover:bg-gray-100"
            >
              {showSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div 
            className={`${showSidebar ? 'block' : 'hidden'} md:block absolute md:relative z-10 bg-white w-3/4 md:w-1/4 min-h-10 border-r border-gray-200`}
          >
            <Sidebar onSectionChange={(id) => console.log(id)} />
          </div>

          <div className="w-full md:w-3/4 flex flex-col md:pl-6 mt-12 md:mt-0">
            <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 sm:p-6 w-full h-full">
              <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
                <h2 className="text-xl sm:text-2xl font-bold text-left mb-4 sm:mb-6">Subscription</h2>
                
                <div className="flex flex-col justify-center items-center h-full">
                  {isLoading ? (
                    <SkeletonLoader />
                  ) : endDate ? (
                    <SubscriptionDetails 
                      investorData={investorData}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full">
                      <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg w-full max-w-xs">
                        <div className="bg-white text-indigo-900 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold">Premium</h3>
                          <p className="text-sm mt-2">Monthly</p>
                          <p className="text-2xl font-bold mt-4">$19 for 1 month</p>
                          <ul className="text-sm mt-4 space-y-2">
                            <li className="flex items-center">
                              <span className="material-icons text-indigo-900 mr-2">list_alt</span>
                              30 Days Plan
                            </li>
                            <li className="flex items-center">
                              <span className="material-icons text-indigo-900 mr-2">list_alt</span>
                              Unlimited model listing
                            </li>
                            <li className="flex items-center">
                              <span className="material-icons text-indigo-900 mr-2">person_add</span>
                              Directly connect investors
                            </li>
                          </ul>
                        </div>
                        <button onClick={handlepremium} className="mt-4 bg-white text-indigo-900 font-semibold py-2 px-4 rounded-lg w-full hover:bg-gray-200">
                          Get Premium
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorSubscription;