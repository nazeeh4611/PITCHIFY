import React, { useEffect, useState } from 'react';
import Sidebar from './InvestorSidebar';
import axios from 'axios';
import logo from "../Layout/Image/logo.jpeg";
import Navbar from '../Layout/Navbar';
import shortlogo from "../Layout/Image/shortlogo.png";
import { useGetToken } from '../../token/Gettoken';
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
        </div>
      </div>
      <div className="mt-4 h-10 bg-gray-300 rounded-lg w-full"></div>
    </div>
  </div>
);

const InvestorDetails = () => {
  const api = axios.create({
    baseURL: baseurl, 
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null); 
  const [investorDetails, setInvestorDetails] = useState<any>(null); 
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleModalToggle = () => setShowModal(!showModal);
  const token = useGetToken("investor");
  const email = token?.email;

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('companyName', companyName);
    if (email) {
      formData.append('email', email);
      formData.append('status', 'pending');
    }
    formData.append('file', file);

    api.post('/investor/verifyinvestor', formData)
      .then(response => {
        setShowModal(false);
        setStatus('pending'); 
      })
      .catch(error => {
        console.error(error);
      });
  };

  const GetInvestor = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/investor/investor-details?email=${email}`);
      if (response.data) {
        setInvestorDetails(response.data);
        setStatus(response.data.status); 
      } else {
        setStatus('not approved'); 
      }
    } catch (error) {
      console.error('Error fetching investor details', error);
      setStatus('not approved'); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      GetInvestor();
    }
    
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
        homeRoute="/investor"
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
                <h2 className="text-xl sm:text-2xl font-bold text-left mb-4 sm:mb-6">Company Verification</h2>
                
                <div className="flex flex-col justify-center items-center h-full">
                  {isLoading ? (
                    <SkeletonLoader />
                  ) : status === 'approved' && investorDetails ? (
                    <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg w-full max-w-xs">
                      <div className="bg-white text-indigo-900 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">Verified Company</h3>
                        <p className="text-sm mt-2">Status: Approved</p>
                        <div className="mt-4 space-y-2">
                          <p><strong>Company Name:</strong> {investorDetails.companyName}</p>
                          <p><strong>Email:</strong> {investorDetails.email}</p>
                        </div>
                      </div>
                      <button 
                        className="mt-4 bg-white text-indigo-900 font-semibold py-2 px-4 rounded-lg w-full"
                        disabled
                      >
                        Verified ✓
                      </button>
                    </div>
                  ) : status === 'pending' ? (
                    <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg w-full max-w-xs">
                      <div className="bg-white text-indigo-900 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">Verification In Progress</h3>
                        <p className="text-sm mt-2">Status: Pending</p>
                        <p className="text-md mt-4">Your request is being processed. Please wait for confirmation from the admin.</p>
                      </div>
                      <button 
                        className="mt-4 bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg w-full cursor-not-allowed"
                        disabled
                      >
                        Requested
                      </button>
                    </div>
                  ) : status === 'not approved' ? (
                    <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg w-full max-w-xs">
                      <div className="bg-white text-indigo-900 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">Company Verification</h3>
                        <p className="text-sm mt-2">Status: Not Verified</p>
                        <p className="text-md mt-4">Please verify your company to access the models.</p>
                      </div>
                      <button 
                        onClick={handleModalToggle} 
                        className="mt-4 bg-white text-indigo-900 font-semibold py-2 px-4 rounded-lg w-full hover:bg-gray-200"
                      >
                        Verify Company
                      </button>
                    </div>
                  ) : (
                    <p className="text-lg">Invalid Status</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-30 p-4">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md border border-gray-300">
                <h2 className="text-xl font-semibold mb-4">Verify Your Company</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
                    <input 
                      type="text" 
                      id="companyName" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="file" className="block text-sm font-medium mb-1">Upload Document</label>
                    <input 
                      type="file" 
                      id="file" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      accept="image/*,application/pdf" 
                      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                      required
                    />
                  </div>

                  <div className="flex justify-between gap-2 sm:gap-4">
                    <button 
                      type="submit" 
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                    >
                      Submit
                    </button>
                    <button 
                      type="button" 
                      onClick={handleModalToggle} 
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InvestorDetails;