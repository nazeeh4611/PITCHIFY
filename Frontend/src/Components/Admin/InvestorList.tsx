import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import Adminnav from './Adminnav';

interface Investor {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  is_Blocked: boolean;
}

const InvestorList: React.FC = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  

  const getInvestor = async () => {
    try {
      // const url = import.meta.env.VITE_API_BASE_URL
      const api = axios.create({
        baseURL:`http://localhost:3009/api` ,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin')}`,
        },
      });
      

      const response = await api.get('/admin/investorlist'); 
      console.log(response);
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
    <>
      <Adminnav />

      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 flex w-full max-w-6xl space-x-6">
          <Sidebar />

          <div
            className="flex-1 bg-white rounded-lg shadow-lg p-6 space-y-4"
            style={{
              minHeight: '80vh',
              height: 'auto',
              overflowY: 'auto',
            }}
          >
            <div className="bg-indigo-950 text-white rounded-lg px-6 py-3 flex justify-center items-center">
              <span className="text-lg font-semibold">Investor List</span>
            </div>

            <div className="space-y-4">
              {investors.map((investor) => (
                <div
                  key={investor._id}
                  className="p-2 flex items-center shadow-md border rounded-lg"
                  style={{
                    height: '4rem',
                  }}
                >
                  <div className="flex items-center space-x-3 w-1/3">
                    {/* <img
                      src={investor.imageUrl || 'default-image-url'}
                      alt={investor.firstname}
                      className="w-10 h-10 rounded-full object-cover"
                    /> */}
                    <div>
                      <h3 className="font-medium text-sm">
                        {investor.firstname} {investor.lastname}
                      </h3>
                    </div>
                  </div>

                  <div className="text-center w-1/3">
                    <p className="text-gray-600 text-sm">{investor.email}</p>
                  </div>

                  <div className="w-1/3 flex justify-end">
                    <button
                      className={`px-4 py-1 rounded-lg text-white text-sm font-medium ${
                        investor.is_Blocked
                          ? 'bg-[#B85C38] hover:bg-[#A34D2F]'
                          : 'bg-[#75B85C] hover:bg-[#64A34D]'
                      }`}
                    >
                      {investor.is_Blocked ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorList;
