import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Sidebar from "./Sidebar";
import axios from "axios";
import Adminnav from "./Adminnav";
import { baseurl } from "../../Constent/regex";

interface Investor {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  profile: string;
  is_Blocked: boolean;
  status: string; 
}

const InvestorList: React.FC = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); 

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getInvestor = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin")}`,
        },
      });

      const response = await api.get("/admin/investorlist");
      console.log(response);
      const fetchedInvestors = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setInvestors(fetchedInvestors);
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  useEffect(() => {
    getInvestor();
  }, []);

  const handleViewClick = (id: string) => {
    navigate(`/admin/investor-details/${id}`);
  };

  return (
    <>
      <Adminnav toggleSidebar={toggleSidebar} />

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}>
      </div>
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-100 z-50 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="pt-16 px-4 h-full">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 p-4 pt-20">
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row w-full max-w-6xl">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-1/4 md:mr-6">
            <Sidebar />
          </div>

          <div
            className="w-full md:flex-1 bg-white rounded-lg shadow-lg p-4 md:p-6 space-y-4"
            style={{
              minHeight: "80vh",
              height: "auto",
              overflowY: "auto",
            }}
          >
            <div className="bg-indigo-950 text-white rounded-lg px-6 py-3 flex justify-center items-center">
              <span className="text-lg font-semibold">Investor List</span>
            </div>

            <div className="space-y-4">
              {investors.map((investor) => (
                <div
                  key={investor._id}
                  className="p-2 flex flex-col sm:flex-row items-start sm:items-center shadow-md border rounded-lg"
                  style={{
                    minHeight: "4rem",
                  }}
                >
                   <div className="flex items-center space-x-3 w-full sm:w-1/3 mb-2 sm:mb-0">
                    <img
                      src={investor.profile}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-medium text-sm">
                        {investor.firstname} {investor.lastname}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 w-full sm:w-1/3 mb-2 sm:mb-0">
                    <div>
                      <h3 className="font-medium text-sm">
                        {investor.firstname} {investor.lastname}
                      </h3>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/3 sm:text-center mb-2 sm:mb-0">
                    <p className="text-gray-600 text-sm">{investor.email}</p>
                  </div>

                  <div className="w-full sm:w-1/3 flex justify-start sm:justify-end space-x-2">
                    {(investor.status === "pending" ||
                      investor.status === "approved") && (
                      <button
                        className="px-4 py-1 rounded-lg text-white text-sm font-medium bg-indigo-900 hover:bg-indigo-600"
                        onClick={() => handleViewClick(investor._id)}
                      >
                        View
                      </button>
                    )}
                    <button
                      className={`px-4 py-1 rounded-lg text-white text-sm font-medium ${
                        investor.is_Blocked
                          ? "bg-[#B85C38] hover:bg-[#A34D2F]"
                          : "bg-[#75B85C] hover:bg-[#64A34D]"
                      }`}
                    >
                      {investor.is_Blocked ? "Unblock" : "Block"}
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