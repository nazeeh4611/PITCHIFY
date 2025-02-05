import React, { useEffect, useState } from 'react';
import Sidebar from './EntrepreneurSidebar';
import Navbar from '../Layout/Navbar';
import logo from "../Layout/Image/logo.jpeg";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useGetToken } from '../../token/Gettoken';
import { baseurl } from '../../Constent/regex';
import shortlogo from "../Layout/Image/shortlogo.png"

interface BusinessModel {
  _id: string;
  businessName: string;
  tagline: string;
  fundinggoal: string;
  industryFocus: string;
  createdAt: string; 
}

const EntrepreneurModels = () => {
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([]);  
  const token = useGetToken("entrepreneur");
  const email = token?.email ?? '';

  const getmodel = async () => {
    try {
      const api = axios.create({
        baseURL:baseurl,
      });

      const response = await api.post("/entrepreneur/models", { email });
      console.log(response.data); 
      setBusinessModels(response.data.businessModels); 
    } catch (error) {
      console.error("Error in getmodel:", error);
    }
  };

  useEffect(() => {
    getmodel();
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
      />

<div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
<div
  className="bg-white rounded-[2%] shadow-lg p-2 sm:p-4 md:p-6 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
  style={{
    minHeight: "80vh",
    padding: "0.5rem", 
  }}
>
          <div className="md:w-1/4 w-full">
            <Sidebar onSectionChange={(id) => console.log(id)} />
          </div>

          <div className="md:w-3/4 w-full md:pl-6 mt-4 md:mt-0">
            <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 w-full h-full">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Uploaded Models</h1>
                <Link to="/entrepreneur/add-model">
                  <button className="bg-[#27115f] text-white px-4 py-2 rounded shadow hover:bg-[#1e0f4b]">
                    Add
                  </button>
                </Link>
              </div>

              <div className="overflow-y-auto h-[60vh] bg-gray-50 border border-gray-200 rounded-lg p-4">
                {businessModels.length > 0 ? (
                  businessModels.map((model) => (
                    <div key={model._id} className="bg-gray-200 rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">posted date: {new Date(model.createdAt).toLocaleDateString()}</span>
                        <Link to={`/entrepreneur/model-details/${model._id}`}>
                        <button className="bg-[#27115f] text-white px-4 py-1 rounded">
                          View
                        </button>
                      </Link>

                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-gray-500 text-lg">Business Name: </span>
                          <span className="text-black text-lg font-medium">{model.businessName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-lg">Category: </span>
                          <span className="text-black text-lg font-medium">{model.industryFocus}</span> {/* Replace with actual category */}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="font-semibold text-lg mb-2">Summary</div>
                        <p className="text-gray-600">{model.tagline}</p> {/* Replace with actual summary or tagline */}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No models available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntrepreneurModels;
