import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import Adminnav from "./Adminnav";
import { baseurl } from "../../Constent/regex";
import { useParams, useNavigate } from "react-router-dom";

interface Investor {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  companyName: string;
  companydetails: string; // Assuming the image URL is part of the investor object
  status: string; // Added status field to the Investor interface
}

const AdminInvestorDetails: React.FC = () => {
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false); // For toast message

  const api = axios.create({
    baseURL: baseurl,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin")}`,
    },
  });

  const getInvestorDetails = async () => {
    try {
      const response = await api.get(`/admin/investor-details?id=${id}`);
      setInvestor(response.data);
    } catch (error) {
      console.error("Error fetching investor details:", error);
    }
  };

  useEffect(() => {
    getInvestorDetails();
  }, []);

  const handleVerify = async () => {
    try {
      if (investor) {
        const email = investor.email;
        const response = await api.post(`/admin/investor-verify`, {
          status: "approved",
          email,
        });
        console.log(response);
        setInvestor({ ...investor, status: "approved" }); // Update investor status
        setShowToast(true); // Show toast message
        setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
      }
    } catch (error) {
      console.error("Error verifying investor:", error);
    }
  };

  return (
    <>
      <Adminnav />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 flex w-full max-w-6xl space-x-6">
          <Sidebar />

          <div
            className="flex-1 bg-white rounded-lg shadow-lg p-6 space-y-4"
            style={{
              minHeight: "80vh",
              height: "auto",
              overflowY: "auto",
            }}
          >
            <div className="bg-indigo-950 text-white rounded-lg px-6 py-3 flex justify-center items-center">
              <span className="text-lg font-semibold">Investor Details</span>
            </div>

            {investor ? (
              <div className="space-y-6">
                <div className="text-center">
                  <img
                    src={investor.companydetails}
                    alt="Investor"
                    className="w-96 h-60 object-cover mx-auto cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Click the image to enlarge
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="text-gray-900">
                      {investor.firstname} {investor.lastname}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-900">{investor.email}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-700">
                      Company Name:
                    </span>
                    <span className="text-gray-900">
                      {investor.companyName}
                    </span>
                  </div>
                </div>

                {/* Buttons below the details */}
                <div className="flex justify-end space-x-4 mt-6">
                  {investor.status !== "approved" ? (
                    <button
                      onClick={handleVerify}
                      className="px-6 py-2 bg-green-700 text-white rounded-lg"
                    >
                      Verify
                    </button>
                  ) : (
                    <span className="text-green-700 font-medium">
                      Investor Verified!
                    </span>
                  )}

                  <button
                    onClick={() => navigate("/admin/investorlist")}
                    className="px-6 py-2 bg-indigo-900 text-white rounded-lg"
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">Loading...</p>
            )}
          </div>
        </div>
      </div>


{isModalOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    onClick={() => setIsModalOpen(false)}
  >
    <div
      className="bg-white p-4 rounded-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={investor?.companydetails}
        alt="Investor"
        className="w-[90vw] h-[75vh] object-contain"
      />
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
        onClick={() => setIsModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
)}



      {/* Toast message */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Investor successfully verified!
        </div>
      )}
    </>
  );
};

export default AdminInvestorDetails;
