import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetToken } from '../../token/Gettoken';
import Sidebar from './InvestorSidebar'; 
import axios from 'axios';
import logo from "../Layout/Image/logo.jpeg";
import Navbar from '../Layout/Navbar';

const InvestorDetails = () => {
  const location = useLocation();
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur"; 

  const token = useGetToken("investor");
  const email = token?.email;

  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    avatar: "/api/placeholder/48/48"
  });

  // State for modal visibility
  const [showNotificationModal, setShowNotificationModal] = useState(true);
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      // Handle the file upload logic here, e.g., using FormData and axios
      console.log('File uploaded:', file);
    } else {
      alert('Please upload an image or PDF file.');
    }
  };

  return (
    <>
      <Navbar
        logoUrl={logo}
        links={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about-us" },
        ]}
      />
      
      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <h2 className="text-xl font-bold">Verification Needed</h2>
            <p className="mt-4">To access models, you need to verify your company or Investor Profile.</p>
            <button
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setShowNotificationModal(false);
                setShowVerificationForm(true);
              }}
            >
              Verify Now
            </button>
          </div>
        </div>
      )}

      {/* Verification Form Modal */}
      {showVerificationForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <h2 className="text-xl font-bold">Company Verification</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Company Documents</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                  className="mt-2 block w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowVerificationForm(false)}
            >
              X
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
        <div
          className="bg-white rounded-[2%] shadow-lg p-2 sm:p-4 md:p-6 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "60vh", // Adjusted to ensure adequate height
            height: "auto",
            padding: "0.5rem",
          }}
        >
          {/* Sidebar Section */}
          <div className="md:w-1/4 w-full flex-grow">
            <Sidebar onSectionChange={(id) => console.log(id)} />
          </div>

          {/* Profile Details Section */}
          <div className="md:w-3/4 w-full md:pl-8 mt-4 md:mt-0 flex-grow">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Profile content goes here */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorDetails;
