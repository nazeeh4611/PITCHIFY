import React, { useState } from 'react';
import Sidebar from './InvestorSidebar'; 
import axios from 'axios';
import logo from "../Layout/Image/logo.jpeg";
import Navbar from '../Layout/Navbar';
import { useGetToken } from '../../token/Gettoken';

const InvestorDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [file, setFile] = useState<File | null>(null);  // File state can be either File or null

  const handleModalToggle = () => setShowModal(!showModal);
  const token = useGetToken("investor");
  const email = token?.email;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!file) {
      console.error('No file selected');
      return;
    }
  
    // Prepare the FormData object
    const formData = new FormData();
    formData.append('companyName', companyName);
    if (email) {
      formData.append('email', email);
    }
    formData.append('file', file);
  
    // Log the FormData entries (for debugging purposes)
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    // Make the POST request
    axios.post('http://localhost:3009/api/investor/verifyinvestor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(response => {
      console.log(response)
      console.log(response.data.status);
      setShowModal(false);
    })
    .catch(error => {
      console.error(error);
    });
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
        <div
          className="bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-6 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "80vh",
            height: "auto",
            padding: "0.5rem",
          }}
        >
          {/* Sidebar Section */}
          <div className="md:w-1/4 w-full">
            <Sidebar onSectionChange={(id) => console.log(id)} />
          </div>

          {/* Content Section */}
          <div className="md:w-3/4 w-full p-4">
            <div className="bg-white border border-gray-300 rounded-lg p-6 h-full">
              <div className="flex flex-col justify-center items-center h-full">
                <div className="text-center">
                  <p className="text-lg mb-4">Please verify your company to access the models.</p>
                  <button 
                    onClick={handleModalToggle} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Verify Company
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
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
                      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}  // Handle file change
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
