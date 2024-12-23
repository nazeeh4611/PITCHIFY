import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

const InvestorList: React.FC = () => {
  const [investors, setInvestors] = useState<any[]>([]);

  const getInvestor = async () => {
    try {
      const response = await axios.get('http://localhost:3009/api/admin/investorlist');
      console.log(response.data, "here");

      // Assuming the response data is an object containing an array of investors.
      const fetchedInvestors = Array.isArray(response.data) ? response.data : [response.data];

      setInvestors(fetchedInvestors);
    } catch (error) {
      console.error('Error fetching investors:', error);
    }
  };

  useEffect(() => {
    getInvestor();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
      <div
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-10 flex w-full max-w-6xl"
        style={{
          minHeight: '80vh',
          height: 'auto',
        }}
      >
        {/* Sidebar with margin-right */}
        <Sidebar />

        {/* Content with overflow-y scroll */}
        <div className="flex-1 p-4 md:p-8 bg-white rounded-lg shadow-lg overflow-y-auto">
          <h1 className="text-3xl font-bold text-[#2D2654] mb-8">Investor List</h1>

          <div className="space-y-4">
            {investors.map((investor) => (
              <div
                key={investor._id} // Use _id as the key
                className="p-4 flex items-center justify-between shadow-md border rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={investor.imageUrl || 'default-image-url'} // Ensure there's an image URL or use a default one
                    alt={investor.firstname} // Use first name or another relevant field for alt text
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{investor.firstname} {investor.lastname}</h3>
                    <p className="text-gray-600">{investor.email}</p>
                  </div>
                </div>
                <button
                  className={`px-6 py-2 rounded-lg text-white font-medium ${
                    investor.is_Blocked
                      ? 'bg-[#B85C38] hover:bg-[#A34D2F]'
                      : 'bg-[#75B85C] hover:bg-[#64A34D]'
                  }`}
                >
                  {investor.is_Blocked ? 'Unblock' : 'Block'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorList;
