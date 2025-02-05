import React, { useEffect, useState } from 'react';
import Sidebar from './InvestorSidebar';
import logo from "../Layout/Image/logo.jpeg";
import Navbar from '../Layout/Navbar';
import shortlogo from "../Layout/Image/shortlogo.png";
import { useNavigate } from 'react-router-dom';
import SubscriptionDetails from './InvestoPlandetails';
import { useGetToken } from '../../token/Gettoken';
import axios from 'axios';
import { baseurl } from '../../Constent/regex';
const InvestorSubscription = () => {
  const token = useGetToken("investor");
  const email = token?.email;
  const api = axios.create({
    baseURL: baseurl,
  });
  const navigate = useNavigate();
  const [investorData, setInvestorData] = useState<any>(null); // Plan data
  const [startDate, setStartDate] = useState<string>(""); // Start date
  const [endDate, setEndDate] = useState<string>("");     // End date

  const handlepremium = async () => {
    try {
      navigate('/investor/plan-details');
    } catch (error) {
      console.error('Error during navigation:', error);
    }
  };

  const GetInvestor = async () => {
    try {
      const response = await api.post("/investor/profile", { email });
      const investor = response.data.investor.Investor;

      const premiumPlan = investor?.premium.plan; 
      const start = investor?.premium.startDate;
      const end = investor?.premium.endDate;

      setInvestorData(premiumPlan);
      setStartDate(start);
      setEndDate(end);
    } catch (error) {
      console.error("Error fetching investor data:", error);
    }
  };

  useEffect(() => {
    GetInvestor();
  }, [email]);

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
          className="bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-6 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "80vh",
            height: "auto",
            padding: "0.5rem",
          }}
        >
          <div className="md:w-1/4 w-full">
            <Sidebar onSectionChange={(id) => console.log(id)} />
          </div>

          <div className="md:w-3/4 w-full p-4">
            <div className="bg-white border border-gray-300 rounded-lg p-6 h-full">
              <div className="flex flex-col justify-center items-center h-full">
                {investorData ? (
                  <SubscriptionDetails 
                    investorData={investorData}
                    startDate={startDate}
                    endDate={endDate}
                  />
                ) : (
                  <div className="flex justify-center items-center md:w-3/4 w-full">
                    <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg w-full max-w-xs">
                      <div className="bg-white text-indigo-900 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">Premium</h3>
                        <p className="text-sm mt-2">Monthly</p>
                        <p className="text-2xl font-bold mt-4">$19 for 1 month</p>
                        <ul className="text-sm mt-4 space-y-2">
                          <li className="flex items-center">
                            <span className="material-icons text-indigo-900 mr-2">list_alt</span>
                            30 Days Plan
                          </li>
                          <li className="flex items-center">
                            <span className="material-icons text-indigo-900 mr-2">list_alt</span>
                            Unlimited model listing
                          </li>
                          <li className="flex items-center">
                            <span className="material-icons text-indigo-900 mr-2">person_add</span>
                            Directly connect investors
                          </li>
                        </ul>
                      </div>
                      <button onClick={handlepremium} className="mt-4 bg-white text-indigo-900 font-semibold py-2 px-4 rounded-lg w-full hover:bg-gray-200">
                        Get Premium
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>               
    </>
  );
};

export default InvestorSubscription;
