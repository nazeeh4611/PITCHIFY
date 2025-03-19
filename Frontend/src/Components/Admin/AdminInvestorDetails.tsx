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
  companyname: string;
  companydetails: string; 
  status: string; 
}

const AdminInvestorDetails: React.FC = () => {
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false); // For toast message

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const api = axios.create({
    baseURL: baseurl,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin")}`,
    },
  });

  const getInvestorDetails = async () => {
    try {
      const response = await api.get(`/admin/investor-details?id=${id}`);
      console.log(response.data.comapanyname);
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
        setInvestor({ ...investor, status: "approved" });
        setShowToast(true); 
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error verifying investor:", error);
    }
  };

  return (
    <>
      <Adminnav toggleSidebar={toggleSidebar} />

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}>
      </div>
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-100 z-50 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="pt-16 px-4 h-full overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {/* Main Content Area - Made scrollable */}
      <div className="flex flex-col md:flex-row justify-center items-start min-h-screen bg-gray-100 p-4 pt-20 overflow-hidden">
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row w-full max-w-6xl h-[85vh]">
          {/* Desktop Sidebar - Made scrollable */}
          <div className="hidden md:block md:w-1/4 md:mr-6 overflow-y-auto h-full">
            <Sidebar />
          </div>

          {/* Main content - Made explicitly scrollable */}
          <div
            className="w-full md:flex-1 bg-white rounded-lg shadow-lg p-4 md:p-6 space-y-4 overflow-y-auto h-full"
          >
            <div className="bg-indigo-950 text-white rounded-lg px-6 py-3 flex justify-center items-center sticky top-0 z-10">
              <span className="text-lg font-semibold">Investor Details</span>
            </div>

            {investor ? (
              <div className="space-y-6 pb-4">
                <div className="text-center">
                  <img
                    src={investor.companydetails}
                    alt="Investor"
                    className="w-full max-w-xs md:max-w-sm lg:max-w-md h-auto object-cover mx-auto cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Click the image to enlarge
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="text-gray-900">
                      {investor.firstname} {investor.lastname}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-900 break-all">{investor.email}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <span className="font-medium text-gray-700">
                      Company Name:
                    </span>
                    <span className="text-gray-900">
                      {investor.companyname}
                    </span>
                  </div>
                </div>

                {/* Buttons below the details */}
                <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                  {investor.status !== "approved" ? (
                    <button
                      onClick={handleVerify}
                      className="px-6 py-2 bg-green-700 text-white rounded-lg"
                    >
                      Verify
                    </button>
                  ) : (
                    <span className="text-green-700 font-medium text-center sm:text-right">
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

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-2 sm:p-4 rounded-lg max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={investor?.companydetails}
              alt="Investor"
              className="w-auto h-auto max-w-full max-h-[70vh] object-contain"
            />
            <div className="mt-4 flex justify-center">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast message */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Investor successfully verified!
        </div>
      )}
    </>
  );
};

export default AdminInvestorDetails;