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
        <button 
          onClick={handlepremium} 
          className="mt-4 bg-white text-indigo-900 font-semibold py-2 px-4 rounded-lg w-full hover:bg-gray-200"
        >
          Get Premium
        </button>
      </div>
    </div>
  );

  const renderInvestorsList = () => (
    <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-center mb-8 mt-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search Investors"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-0 top-0 h-full bg-indigo-900 text-white px-4 py-2 rounded-r-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="hidden md:flex justify-between border-b pb-4 mb-2 text-gray-700 font-semibold">
        <div className="w-1/3 pl-20">Name</div>
        <div className="w-1/3 text-center">Company Name</div>
        <div className="w-1/3 text-center">Investment Range</div>
        <div className="w-24"></div>
      </div>

      <div className="space-y-4 mt-4">
        {filteredInvestors.map((investor) => (
          <div 
            key={investor._id} 
            className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4"
          >
            <div className="flex items-center mb-2 md:mb-0 md:w-1/3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                <img
                  src={investor.firstname}
                  alt={investor.firstname}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium">{investor.firstname} {'\u00A0'}{investor.lastname}</span>
            </div>
            
            <div className="mb-2 md:mb-0 md:w-1/3 md:text-center">
              <span className="md:hidden font-semibold mr-2">Company Name:</span>
              {investor.companyname}
            </div>
            
            <div className="mb-4 md:mb-0 md:w-1/3 md:text-center">
              <span className="md:hidden font-semibold mr-2">Investment Range:</span>
              {investor.lastname}
            </div>
            
            <button 
              onClick={() => handleConnect(investor._id)}
              className="bg-indigo-900 text-white py-2 px-4 rounded-md self-start md:self-center hover:bg-indigo-800 transition duration-200"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar 
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/entrepreneur" },
          { label: "About Us", href: "/about-us" },
        ]}
      />
      <div className="min-h-screen bg-gray-100 flex justify-center p-4 mt-16">
        {isPremiumActive ? renderInvestorsList() : renderPremiumUI()}
      </div>
    </>
  );
};

export default InvestorSearchPage;