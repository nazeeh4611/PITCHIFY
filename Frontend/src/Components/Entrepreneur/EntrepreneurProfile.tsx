import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { ArrowLeft, Edit2, Plus } from 'lucide-react';
import axios from 'axios';
import { useGetToken } from '../../token/Gettoken';
import Profile from "../Layout/Image/profile.jpg";
import logo from "../Layout/Image/logo.jpeg";
import Navbar from '../Layout/Navbar';

const EntrepreneurProfile = () => {
  const location = useLocation();
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur";
  const token = useGetToken("entrepreneur");
  const email = token?.email;

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
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
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar
          logoUrl={logo}
          links={[
            { label: "Home", href: "/" },
            { label: "Explore Premium", href: "/explore-premium" },
            { label: "About Us", href: "/about-us" },
            { label: "Login", href: "/select" },
          ]}
        />
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden bg-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Pitchify Logo" className="h-8" />
          <span className="text-xl font-semibold">Pitchify</span>
        </div>
        <div className="flex space-x-4">
          <a href="/" className="text-gray-600">Home</a>
          <a href="/about-us" className="text-gray-600">About Us</a>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-[2%] shadow-lg p-4 sm:p-6 md:p-10 flex flex-col md:flex-row w-full max-w-[1200px] relative z-10" style={{ minHeight: "80vh" }}>
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 bg-white rounded-lg shadow" style={{ borderColor: "#F5F5F5", height: "auto" }}>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <ArrowLeft className="h-5 w-5 cursor-pointer" />
                <span className="text-lg">Back</span>
              </div>

              <div className="flex items-center space-x-3">
                <img src={imagePreview || Profile} className="h-12 w-12 rounded-full" alt="Profile" />
                <h2 className="text-xl font-semibold">
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstname"
                      value={updatedProfile.firstname}
                      onChange={handleInputChange}
                      className="w-full text-xl border-none focus:outline-none bg-blue-50 border-2 border-blue-300 rounded-md"
                      style={{ caretColor: 'blue' }}
                      placeholder="Edit your name"
                    />
                  ) : (
                    profile.firstname
                  )}
                </h2>
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

          {/* Right Section */}
          <div className="flex-1 ml-6" style={{ width: "100%", maxWidth: "calc(75% - 1rem)" }}>
            <div className="flex justify-between items-center mb-6 gap-4">
              <div className="flex flex-wrap gap-4 w-full justify-between">
                <button className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 font-medium w-full md:w-auto">Models</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-md w-full md:w-auto">Chat</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-md w-full md:w-auto">Rating & Reviews</button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium rounded-md w-full md:w-auto">Subscription</button>
              </div>
            </div>

            <div className="border-t border-gray-300 mt-4 mb-6"></div>

            <div className="bg-white p-6 rounded-lg border border-gray-200" style={{ minHeight: "300px", width: "100%" }}>
              <div className="text-center text-gray-500 py-8">No content available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-gray-50">
        <div className="p-4">
          <div className="flex flex-col items-center mb-8">
            <img src={profile.avatar || Profile} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
            <h1 className="text-2xl font-bold mb-2">{profile.firstname}</h1>
          </div>

          <nav className="flex flex-col space-y-4">
            <a href="#profile" className="text-xl font-semibold p-3 border-b border-gray-200">Profile</a>
            <a href="#models" className="text-xl font-semibold p-3 border-b border-gray-200">Models</a>
            <a href="#chat" className="text-xl font-semibold p-3 border-b border-gray-200">Chat</a>
            <a href="#rating" className="text-xl font-semibold p-3 border-b border-gray-200">Rating & Reviews</a>
            <a href="#subscription" className="text-xl font-semibold p-3 border-b border-gray-200">Subscription</a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default EntrepreneurProfile;