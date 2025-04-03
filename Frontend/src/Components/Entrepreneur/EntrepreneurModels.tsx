import React, { useEffect, useState } from 'react';
import Sidebar from './EntrepreneurSidebar';
import Navbar from '../Layout/Navbar';
import logo from "../Layout/Image/logo.jpeg";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useGetToken } from '../../token/Gettoken';
import { baseurl } from '../../Constent/regex';
import shortlogo from "../Layout/Image/shortlogo.png";
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface BusinessModel {
  _id: string;
  businessName: string;
  tagline: string;
  fundinggoal: string;
  industryFocus: string;
  createdAt: string; 
}

interface PremiumPlan {
  startDate: string;
  endDate: string;
  plan: {
    planName: string;
    isActive: boolean;
  };
}

interface ProfileData {
  premium?: PremiumPlan;
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

const CustomModal = ({ 
  show, 
  onClose, 
  onUpgrade 
}: { 
  show: boolean; 
  onClose: () => void; 
  onUpgrade: () => void;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-auto relative">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium text-[#1e1b4b]">Premium Required</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Free Plan Limit Reached</h3>
            <p className="text-gray-500 mb-4">
              You've reached the maximum limit of business models allowed on the free plan. 
              Upgrade to premium to add unlimited business models and unlock additional features.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Premium Plan Benefits:</h4>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited business models
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support from investors
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced analytics dashboard
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button 
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1e1b4b] text-base font-medium text-white hover:bg-[#29256d] focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onUpgrade}
          >
            Upgrade Now
          </button>
          <button 
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

const EntrepreneurModels = () => {
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([]);  
  const token = useGetToken("entrepreneur");
  const email = token?.email ?? '';
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const getmodel = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
      });

      const response = await api.post("/entrepreneur/models", { email });
      setBusinessModels(response.data.businessModels); 
    } catch (error) {
      console.error("Error in getmodel:", error);
    }
  };

  const accessData = async () => {
    if (!email) {
      return;
    }

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
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } 
  };

  const handleAddButtonClick = () => {
    const hasPremium = profile?.premium?.plan?.isActive === true;
    
    if (hasPremium || businessModels.length === 0) {
      navigate("/entrepreneur/add-model");
    } else {
      setShowPremiumModal(true);
    }
  };

  const handleUpgradePremium = () => {
    navigate("/entrepreneur/premium-plans");
    setShowPremiumModal(false);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    getmodel();
    accessData();
    
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
  }, []); 

  return (
    <>
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/entrepreneur" },
          { label: "About Us", href: "/about-us" },
        ]}
        homeRoute="/entrepreneur" 
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h1 className="text-2xl font-semibold">Uploaded Models</h1>
                <button 
                  onClick={handleAddButtonClick}
                  className="bg-[#1e1b4b] text-white px-4 py-2 rounded shadow hover:bg-[#29256d]"
                >
                  Add
                </button>
              </div>

              {!profile?.premium?.plan?.isActive && businessModels.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
                  <div className="flex items-start sm:items-center flex-col sm:flex-row">
                    <div className="flex-shrink-0 mb-2 sm:mb-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-0 sm:ml-3">
                      <p className="text-sm text-yellow-700">
                        You have reached your free plan limit. Upgrade to premium to add more business models.
                        <button 
                          onClick={handleUpgradePremium}
                          className="block sm:inline-block mt-2 sm:mt-0 sm:ml-2 font-medium underline text-yellow-700 hover:text-yellow-600"
                        >
                          Upgrade now
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-y-auto h-[60vh] bg-gray-50 border border-gray-200 rounded-lg p-4">
                {businessModels.length > 0 ? (
                  businessModels.map((model) => (
                    <div key={model._id} className="bg-gray-200 rounded-lg p-4 sm:p-6 mb-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                        <span className="text-gray-600 text-sm">posted date: {new Date(model.createdAt).toLocaleDateString()}</span>
                        <Link to={`/entrepreneur/model-details/${model._id}`}>
                          <button className="bg-[#1e1b4b] text-white px-4 py-1 rounded">
                            View
                          </button>
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-gray-500 text-base sm:text-lg">Business Name: </span>
                          <span className="text-black text-base sm:text-lg font-medium">{model.businessName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-base sm:text-lg">Category: </span>
                          <span className="text-black text-base sm:text-lg font-medium">{model.industryFocus}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="font-semibold text-base sm:text-lg mb-2">Summary</div>
                        <p className="text-gray-600 text-sm sm:text-base">{model.tagline}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500 text-lg">No models available. Click "Add" to create your first business model.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomModal 
        show={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onUpgrade={handleUpgradePremium}
      />
    </>
  );
};

export default EntrepreneurModels;