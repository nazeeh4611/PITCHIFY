import React from 'react';
import { useLocation } from "react-router-dom";
import { ArrowLeft, Edit2 } from 'lucide-react';
import axios from 'axios';

interface SavedModel {
  postedDate: string;
  businessName: string;
  category: string;
  summary: string;
}

interface UserProfile {
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

const EntrepreneurProfile = () => {

    const location = useLocation();
    const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur"; // Determine user type
  const profile: UserProfile = {
    name: "Joseph",
    role: "Investor",
    email: "joseph123@gmail.co",
    phone: "9090909090",
    avatar: "/api/placeholder/48/48"
  };

  const savedModel: SavedModel = {
    postedDate: "12-12-2024",
    businessName: "Healthflex",
    category: "Health & Wellness",
    summary: "An AI-driven wearable device designed to revolutionize personal health monitoring, making it an accessible reality for all individuals."
  };


  const getDetails = async()=>{
      try {
        const response = await axios.get(`http://localhost:3009/api/${userType}/profile`)
      } catch (error) {
        
      }
    }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
        <div
          className="bg-white rounded-[2%] shadow-lg p-4 sm:p-6 md:p-10 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "80vh",
            height: "auto",
          }}
        >
          <div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Sidebar */}
                <div className="w-full md:w-1/4 bg-white rounded-lg shadow" style={{ borderColor: "#F5F5F5", minHeight: "70vh" }}>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <ArrowLeft className="h-5 w-5 cursor-pointer" />
                      <span className="text-lg">Back</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="h-12 w-12 rounded-full"
                      />
                      <h2 className="text-xl font-semibold">{profile.name}</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500">Role</label>
                        <p className="text-gray-900">{profile.role}</p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="text-gray-900">{profile.email}</p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500">Phone</label>
                        <p className="text-gray-900">{profile.phone}</p>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                      <Edit2 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>

                {/* Main Content */}

                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-6 gap-4">
                    {/* Buttons row */}
                    <div className="flex flex-wrap gap-4 w-full justify-between">
                      <button className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 font-medium w-full md:w-auto">
                        Saved Models
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-md w-full md:w-auto">
                        Chat
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-md w-full md:w-auto">
                      Exclusive Models
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-md w-full md:w-auto">
                        Subscription
                      </button>
                    </div>
                  </div>

                  {/* Added line under the "Saved Models" and "Chat" buttons */}
                  <div className="border-t border-gray-300 mt-4 mb-6"></div>

                  {/* Move the "ADD" button to the right */}
                  <div className="flex justify-end mb-4">
                    <button className="px-6 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800">
                      ADD
                    </button>
                  </div>

                  {/* Saved Model Card */}
                  <div className="rounded-lg shadow" style={{ background: "#F5F5F5", minHeight: "220px" }}>
                    <div className="p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <p className="text-gray-500">posted date : {savedModel.postedDate}</p>
                        <button className="px-6 py-1.5 bg-indigo-900 text-white rounded-md hover:bg-indigo-800">
                          View
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                          <div>
                            <span className="text-gray-500">Business Name: </span>
                            <span className="font-medium">{savedModel.businessName}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Category : </span>
                            <span className="font-medium">{savedModel.category}</span>
                          </div>
                        </div>
                        {/* Line under category */}
                        <div className="border-t border-gray-300 mt-2"></div>

                        <div>
                          <div className="text-gray-500 mb-2">Summary</div>
                          <p className="text-gray-700 leading-relaxed">{savedModel.summary}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntrepreneurProfile;
