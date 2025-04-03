import React, { useEffect, useState } from 'react';
import shortlogo from "../Layout/Image/shortlogo.png";
import axios from 'axios';
import { baseurl } from '../../Constent/regex';
import Navbar from '../Layout/Navbar';
import logo from "../Layout/Image/logo.jpeg";
import { Investor } from '../../Interfacetypes/types';
import { useGetToken } from '../../token/Gettoken';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Footer from '../Layout/Footer';

interface PremiumPlan {
  _id: string;
  planName: string;
  description: string;
  planPrice: number;
  Duration: number;
}

interface Premium {
  endDate: string;
  startDate: string;
  plan: PremiumPlan;
}

interface Profile {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  premium: Premium | null;
  _id: string;
}

const InvestorSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [investors, setInvestor] = useState<Investor[]>([]);
  const [profile, setProfile] = useState<Profile>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    avatar: "",
    role: "Entrepreneur",
    premium: null,
    _id: ""
  });

  const token = useGetToken("entrepreneur");
  const email = token?.email;
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: baseurl,
  });

  const accessData = async () => {
    if (!email) return;

    try {
      const response = await axios.post(
        `${baseurl}/entrepreneur/profile`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
   
      if (response.data) {
        const userData = response.data.entrepreneur;
        setProfile(userData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to fetch profile data");
    }
  };

  const getInvestors = async () => {
    try {
      const response = await api.get("/entrepreneur/get-investors");
      setInvestor(response.data);
    } catch (error) {
      console.error("Error fetching investors:", error);
      toast.error("Failed to fetch investors");
    }
  };

  const handleConnect = async (investorId: string) => {
    try {
      const response = await api.post('/entrepreneur/create-chat', {
        investorId: investorId,
        entrepreneurId: profile._id,
        entrepreneurEmail: email
      });

      if (response.data.chatId) {
        toast.success("Chat connection established!");
        navigate('/entrepreneur/chat');
      } else {
        toast.error("Failed to create chat connection");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to connect with investor");
    }
  };

  const handlepremium = () => {
    navigate('/entrepreneur/plan-details');
  };

  useEffect(() => {
    getInvestors();
    accessData();
  }, []);

  const isPremiumActive = profile.premium && new Date(profile.premium.endDate) > new Date();

  const filteredInvestors = investors.filter(investor =>
    investor.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.companyname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPremiumUI = () => (
    <div className="flex justify-center items-center w-full h-[80vh]">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-800 text-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm transform transition-all duration-300 hover:scale-105">
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">Premium</h2>
            <span className="bg-yellow-400 text-indigo-900 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full">Recommended</span>
          </div>
          <div className="flex items-baseline my-6">
            <span className="text-5xl font-extrabold">$19</span>
            <span className="text-xl ml-2 font-medium text-indigo-200">/month</span>
          </div>
          <div className="border-t border-indigo-700 my-6"></div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>30 Days Access</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Unlimited Model Listings</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Direct Investor Connections</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Priority Support</span>
            </li>
          </ul>
        </div>
        <div className="px-8 pb-8">
          <button 
            onClick={handlepremium} 
            className="w-full bg-white text-indigo-900 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );

  const renderInvestorsList = () => (
    <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Investor Directory</h1>
        <p className="text-gray-600 text-center mb-6">Find and connect with investors that match your startup needs</p>
        
        <div className="relative w-full max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or company..."
            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="hidden md:flex justify-between border-b border-gray-200 pb-4 mb-6 text-sm uppercase tracking-wider font-semibold text-gray-600">
        <div className="w-1/3 pl-4">Investor</div>
        <div className="w-1/3 text-center">Company</div>
        <div className="w-1/3 text-center">Investment Range</div>
        <div className="w-28"></div>
      </div>

      {filteredInvestors.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No investors found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredInvestors.map((investor) => (
            <div 
              key={investor._id} 
              className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 group hover:bg-gray-50 rounded-lg transition-all duration-200 p-4"
            >
              <div className="flex items-center mb-4 md:mb-0 md:w-1/3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-indigo-300 to-purple-300 mr-4 shadow-md">
                  {investor.firstname ? (
                    <img
                      src={investor.firstname}
                      alt={`${investor.firstname} ${investor.lastname}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                      {investor.firstname?.charAt(0) || ""}
                      {investor.lastname?.charAt(0) || ""}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{investor.firstname} {investor.lastname}</h3>
                  <p className="text-gray-500 text-sm">Investor</p>
                </div>
              </div>
              
              <div className="mb-4 md:mb-0 md:w-1/3 md:text-center">
                <div className="md:hidden text-xs font-medium text-gray-500 uppercase mb-1">Company</div>
                <span className="font-medium text-gray-800">{investor.companyname}</span>
              </div>
              
              <div className="mb-4 md:mb-0 md:w-1/3 md:text-center">
                <div className="md:hidden text-xs font-medium text-gray-500 uppercase mb-1">Investment Range</div>
                <span className="font-medium text-gray-800">{investor.lastname}</span>
              </div>
              
              <button 
                onClick={() => handleConnect(investor._id)}
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg self-start md:self-center hover:bg-indigo-700 transition duration-200 shadow-md group-hover:scale-105 transform"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar 
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/entrepreneur" },
          { label: "About Us", href: "/about-us" },
        ]}
        homeRoute="/entrepreneur"
      />
      <div className="flex-grow flex justify-center items-center p-6 mt-16">
        {isPremiumActive ? renderInvestorsList() : renderPremiumUI()}
      </div>
      <Footer/>
    </div>
  );
};

export default InvestorSearchPage;