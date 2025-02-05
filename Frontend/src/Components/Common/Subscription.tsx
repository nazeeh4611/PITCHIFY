import React from "react";
import SubscriptionDetails from "../Investor/InvestoPlandetails";

const PremiumCard: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg max-w-sm w-full">
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
        <button className="mt-6 bg-white text-indigo-900 font-semibold py-2 px-4 rounded-lg w-full hover:bg-gray-200">
          Get Premium
        </button>
      </div>
    </div>
  );
};

export default PremiumCard;
