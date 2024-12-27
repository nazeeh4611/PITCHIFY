import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { ArrowLeft, Edit2, Plus } from 'lucide-react';
import axios from 'axios';
import { useGetToken } from '../../token/Gettoken';
import Profile from "../Layout/Image/profile.jpg";
import logo from "../Layout/Image/logo.jpeg";

import Navbar from '../Layout/Navbar';

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
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur"; 

  const token = useGetToken("entrepreneur")
  const email = token?.email

  const [profile, setProfile] = useState({
    firstname: "",
    email: "",
    phone: "",
    avatar: "/api/placeholder/48/48"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ ...profile });
  const [imagePreview, setImagePreview] = useState(profile.avatar);


  const accessData = async () => {
    if (!email) {
      console.error("Email is not available");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3009/api/${userType}/profile`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setProfile(response.data.entrepreneur);
        setUpdatedProfile(response.data.entrepreneur);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    accessData();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setUpdatedProfile({ ...updatedProfile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3009/api/${userType}/editprofile`,
        updatedProfile,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data) {
        setProfile(updatedProfile); 
        setIsEditing(false);
      } else {
        console.error("Error updating profile:", response.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };


  const savedModel: SavedModel = {
    postedDate: "12-12-2024",
    businessName: "Healthflex",
    category: "Health & Wellness",
    summary: "An AI-driven wearable device designed to revolutionize personal health monitoring, making it an accessible reality for all individuals."
  };

  return (
    <>
      <Navbar
        logoUrl={logo}
        links={[
          { label: "Home", href: "/" },
          { label: "Explore Premium", href: "/explore-premium" },
          { label: "About Us", href: "/about-us" },
          { label: "Login", href: "/select" },
        ]}
      />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
        <div
          className="bg-white rounded-[2%] shadow-lg p-4 sm:p-6 md:p-10 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "80vh",
            height: "auto",
          }}
        >
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Sidebar */}
              <div className="w-full md:w-1/4 bg-white rounded-lg shadow" style={{ borderColor: "#F5F5F5", minHeight: "auto" }}> 
                <div className="p-6 space-y-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <ArrowLeft className="h-5 w-5 cursor-pointer" />
                    <span className="text-lg">Back</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img
                      src={imagePreview || Profile}
                      className="h-12 w-12 rounded-full"
                      alt="Profile"
                    />
                    {isEditing && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="profileImage"
                      />
                    )}
                    {isEditing && (
                      <label htmlFor="profileImage" className="cursor-pointer text-blue-500">
                        <Plus className="h-5 w-5" />
                      </label>
                    )}
                    <h2 className="text-xl font-semibold">{isEditing ? (
                      <input
                        type="text"
                        name="firstname"
                        value={updatedProfile.firstname}
                        onChange={handleInputChange}
                        className="w-full text-xl border-none focus:outline-none bg-blue-50 border-2 border-blue-300 rounded-md"
                        style={{ caretColor: 'blue' }} // Makes cursor blue
                        placeholder="Edit your name" // Add placeholder text
                      />
                    ) : profile.firstname}</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Role</label>
                      <p className="text-gray-900">Entrepreneur</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="text-gray-900">{profile.email}</p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={updatedProfile.phone}
                          onChange={handleInputChange}
                          className="w-full text-gray-900 border-none focus:outline-none bg-blue-50 border-2 border-blue-300 rounded-md"
                          style={{ caretColor: 'blue' }}
                          placeholder="Edit your phone number" 
                        />
                      ) : (
                        <p className="text-gray-900">{profile.phone}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg text-white bg-indigo-900 hover:bg-blue-800"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-6 gap-4">
                  <div className="flex flex-wrap gap-4 w-full justify-between">
                    <button className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 font-medium w-full md:w-auto">
                       Models
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-md w-full md:w-auto">
                      Chat
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-md w-full md:w-auto">
                      Rating & Reviews
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-md w-full md:w-auto">
                      Subscription
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-300 mt-4 mb-6"></div>

                <div className="flex justify-end mb-2">
                  <button className="px-6 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800">
                    View
                  </button>
                </div>

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
    </>
  );
};

export default EntrepreneurProfile;
