import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetToken } from '../../token/Gettoken';
import Sidebar from './InvestorSidebar'; 
import axios from 'axios';
import profileImage from "../Layout/Image/profile.jpg";
import logo from "../Layout/Image/logo.jpeg";
import { FaPlus } from 'react-icons/fa'; 
import Navbar from '../Layout/Navbar';
import { Investor } from '../../Interfacetypes/types';
import shortlogo from "../Layout/Image/shortlogo.png"

const InvestorProfile = ():JSX.Element  | null => {

  const location = useLocation();
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur"; 

  const token = useGetToken("investor");
  console.log(token,"the token")
  const email = token?.email;
console.log(email,"the email")
const [profile, setProfile] = useState<Partial<Investor>>({
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  avatar: "/api/placeholder/48/48"
});

  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ ...profile });
  const [imagePreview, setImagePreview] = useState(profile.avatar);

  const accessData = async () => {
    if (!email) {
      console.log("Email is not available.");
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:3009/api/${userType}/profile`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (response.data.investor.Investor) {

        setProfile(response.data.investor.Investor); 
      } else {
       console.log("Unexpected response structure.");
      }
    } catch (error) {
      console.log("Error fetching profile data.");
      console.error("Error fetching profile data:", error);
    }
  };
  
  useEffect(() => {
    accessData();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    setUpdatedProfile({ ...profile });
    setImagePreview(profile.avatar);
  }, [profile]);

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
          className="bg-white rounded-[2%] shadow-lg p-2 sm:p-4 md:p-6 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "20vh", 
            height: "auto",
            padding: "0.5rem",
          }}
        >
          <div className="md:w-1/4 w-full">
            <Sidebar onSectionChange={(id) => console.log(id)} />
          </div>

          <div className="md:w-3/4 w-full md:pl-8 mt-4 md:mt-0">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={profileImage || profile.avatar || imagePreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  {isEditing && (
                    <label htmlFor="profileImage" className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full cursor-pointer">
                      <FaPlus />
                    </label>
                  )}
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="text-center w-full">
                  <div className="flex justify-center items-center">
                    <div className="min-h-[2.5rem] flex items-center w-40">
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstname"
                          value={updatedProfile.firstname}
                          onChange={handleInputChange}
                          className="font-semibold bg-blue-50 focus:outline-none px-2 w-40"
                          placeholder="First name"
                        />
                      ) : (
                        <h1 className="text-xl font-semibold w-40">{profile.firstname}</h1>
                      )}
                    </div>
                    
                    <div className="w-8"></div>
                    
                    <div className="min-h-[2.5rem] flex items-center w-40">
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastname"
                          value={updatedProfile.lastname}
                          onChange={handleInputChange}
                          className="font-semibold bg-blue-50 focus:outline-none px-2 w-40"
                          placeholder="Last name"
                        />
                      ) : (
                        <h1 className="text-xl font-semibold w-40">{profile.lastname}</h1>
                      )}
                    </div>
                  </div>
                  <p className=" text-[#00186E] font-medium mt-2">Investor</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={updatedProfile.phone}
                          onChange={handleInputChange}
                          className="w-full font-medium bg-blue-50 focus:outline-none px-2"
                          placeholder="Edit your phone number"
                        />
                      ) : (
                        <p className="font-medium">{profile.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div>
                  <label className="text-sm text-gray-500">Subscription Plan</label>
                  <p className="font-medium">Premium</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Subscription Expiry</label>
                  <p className="font-medium">2025-12-31</p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
              {isEditing ? (
  <div className="flex gap-4 mt-4">
    <button
      onClick={handleSaveChanges}
      className="px-4 py-2 bg-green-600 text-white rounded-md"
    >
      Save Changes
    </button>
    <button
      onClick={() => {
        setUpdatedProfile(profile); 
        setImagePreview(profile.avatar);
        setIsEditing(false); 
      }}
      className="px-4 py-2 bg-red-600 text-white rounded-md"
    >
      Cancel
    </button>
  </div>
) : (
  <button
    onClick={() => setIsEditing(true)}
    className="mt-4 px-4 py-2 bg-[#00186E] text-white rounded-md"
  >
    Edit Profile
  </button>
)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorProfile;
