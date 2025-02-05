import React, { useEffect, useState } from 'react';
import Sidebar from './InvestorSidebar';
import axios from 'axios';
import logo from "../Layout/Image/logo.jpeg";
import Navbar from '../Layout/Navbar';
import { useGetToken } from '../../token/Gettoken';
import { baseurl } from '../../Constent/regex';
import shortlogo from "../Layout/Image/shortlogo.png"

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
  const handleModalToggle = () => setShowModal(!showModal);
  const token = useGetToken("investor");
  const email = token?.email;

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
        console.log(response);
        setShowModal(false);
        setStatus('pending'); 
      })
      .catch(error => {
        console.error(error);
      });
  };

  const GetInvestor = async () => {
    try {
      const response = await api.get(`/investor/investor-details?email=${email}`);
      if (response.data) {
        setInvestorDetails(response.data);
        setStatus(response.data.status); 
        console.log('Investor Details:', response.data);
      } else {
        setStatus('not approved'); 
      }
    } catch (error) {
      console.error('Error fetching investor details', error);
      setStatus('not approved'); 
    }
  };

  useEffect(() => {
    if (email) {
      console.log('Fetching investor details for email:', email);
      GetInvestor();
    } else {
      console.log('Email is undefined');
    }
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
        <div
          className="bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-6 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "80vh",
            height: "auto",
            padding: "0.5rem",
          }}
        >
          <div className="md:w-1/4 w-full">
            <Sidebar onSectionChange={(id) => console.log(id)} />
          </div>

          <div className="md:w-3/4 w-full p-4">
            <div className="bg-white border border-gray-300 rounded-lg p-6 h-full">
              <div className="flex flex-col justify-center items-center h-full">
                <div className="text-center">
                  {status === null ? (
                    <p className="text-lg">Loading...</p>
                  ) : status === 'approved' && investorDetails ? (
                    <div>
                      <p className="text-lg mb-4">Your company is approved!</p>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p><strong>Company Name:</strong> {investorDetails.companyName}</p>
                        <p><strong>Email:</strong> {investorDetails.email}</p>
                      </div>
                    </div>
                  ) : status === 'pending' ? (
                    <>
                      <p className="text-lg mb-4 text-green-600">Your request is being processed. Please wait for confirmation from the admin.</p>
                      <button 
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg cursor-not-allowed"
                        disabled
                      >
                        Requested
                      </button>
                    </>
        
                  ) : status === 'not approved' ? (
                    <>
                      <p className="text-lg mb-4">Please verify your company to access the models.</p>
                      <button 
                        onClick={handleModalToggle} 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                      >
                        Verify Company
                      </button>
                    </>
                  ) : (
                    <p className="text-lg">Invalid Status</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 border border-gray-300">
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

                  <div className="flex justify-between gap-4">
                    <button 
                      type="submit" 
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors duration-200"
                    >
                      Submit
                    </button>
                    <button 
                      type="button" 
                      onClick={handleModalToggle} 
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors duration-200"
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
