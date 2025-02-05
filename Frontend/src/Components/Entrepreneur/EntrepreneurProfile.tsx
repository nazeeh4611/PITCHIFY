import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetToken } from "../../token/Gettoken";
import Sidebar from "./EntrepreneurSidebar";
import axios from "axios";
import profileImage from "../Layout/Image/profile.jpg";
import logo from "../Layout/Image/logo.jpeg";
import Navbar from "../Layout/Navbar";
import shortlogo from "../Layout/Image/shortlogo.png";
import { FaEdit, FaPlus } from "react-icons/fa";

const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {/* Profile Image and Name Section */}
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
      <div className="flex justify-center items-center gap-8">
        <div className="h-8 bg-gray-200 w-40 rounded"></div>
        <div className="h-8 bg-gray-200 w-40 rounded"></div>
      </div>
      <div className="h-4 bg-gray-200 w-24 rounded"></div>
    </div>

    {/* Contact Information Section */}
    <div className="space-y-4">
      <div className="border-t pt-4">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="h-4 bg-gray-200 w-20 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 w-48 rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 w-20 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 w-48 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Subscription Section */}
    <div className="border-t pt-4 space-y-4">
      <div>
        <div className="h-4 bg-gray-200 w-32 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 w-24 rounded"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 w-36 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 w-32 rounded"></div>
      </div>
    </div>

    {/* Button Section */}
    <div className="border-t pt-4 mt-6">
      <div className="h-10 bg-gray-200 w-32 rounded"></div>
    </div>
  </div>
);

const EntrepreneurProfile = (): JSX.Element => {
  const location = useLocation();
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur";
  const token = useGetToken("entrepreneur");
  const email = token?.email;

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    avatar: "",
    role: "Entrepreneur",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    avatar: "",
    role: "Entrepreneur",
  });

  const [updatedImageFile, setUpdatedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(profileImage);

  const accessData = async () => {
    if (!email) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3009/api/${userType}/profile`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        const userData = response.data.entrepreneur;
        const userWithAvatar = {
          ...userData,
          avatar: userData.profile || profileImage
        };
        setProfile(userWithAvatar);
        setUpdatedProfile(userWithAvatar);
        setImagePreview(userData.profile || profileImage);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    accessData();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpdatedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("email", updatedProfile.email);
    formData.append("firstname", updatedProfile.firstname);
    formData.append("lastname", updatedProfile.lastname);
    formData.append("phone", updatedProfile.phone);

    if (updatedImageFile) {
      formData.append("profile", updatedImageFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:3009/api/${userType}/editprofile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setProfile({ ...updatedProfile, avatar: imagePreview });
        setIsEditing(false);
        setUpdatedImageFile(null);
      } else {
        console.error("Error updating profile:", response.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setUpdatedProfile(profile);
    setImagePreview(profile.avatar || profileImage);
    setIsEditing(false);
    setUpdatedImageFile(null);
  };

  const renderProfileContent = () => {
    if (isLoading) {
      return <ProfileSkeleton />;
    }

    return (
      <>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className={`relative ${isUpdating ? 'opacity-50' : ''}`}>
              <img
                src={isEditing ? imagePreview : (profile.avatar || profileImage)}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = profileImage;
                }}
              />
              {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {isEditing && !isUpdating && (
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
              disabled={!isEditing || isUpdating}
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
                    disabled={isUpdating}
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
                    disabled={isUpdating}
                  />
                ) : (
                  <h1 className="text-xl font-semibold w-40">{profile.lastname}</h1>
                )}
              </div>
            </div>
            <p className="text-[#00186E] font-medium mt-2">Entrepreneur</p>
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
                    disabled={isUpdating}
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
                className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                disabled={isUpdating}
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
      </>
    );
  };

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
              {renderProfileContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntrepreneurProfile;