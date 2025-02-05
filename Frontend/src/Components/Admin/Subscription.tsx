import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import Adminnav from "./Adminnav";
import { baseurl } from '../../Constent/regex';
import PaymentForm from "../Common/Payment";

interface PremiumPlanState {
    planName: string;
    Duration: number; 
  planPrice: number;
  description: string; 
}

interface FetchedPremiumPlan {
  _id: string;
  planName: string;
  Duration: number;
  planPrice: number;
  description: string; 
  is_Listed: boolean;
  features: string[]; 
  buttonText: string;  
}

const PremiumPlans: React.FC = () => {
  const [premiumPlans, setPremiumPlans] = useState<FetchedPremiumPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPremiumPlan, setNewPremiumPlan] = useState<PremiumPlanState>({
    planName: "",
    Duration: 0,
    planPrice: 0,
    description: "",
  });
  const [editPremiumPlan, setEditPremiumPlan] = useState<FetchedPremiumPlan | null>(null);
  const [subscribedPlan, setSubscribedPlan] = useState<FetchedPremiumPlan | null>(null); 
  const getPremiumPlans = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin")}`,
        },
      });

      const response = await api.get("/admin/premium-plan");
      setPremiumPlans(response.data || []);
    } catch (error) {
      console.error("Error fetching premium plans:", error);
    }
  };

  useEffect(() => {
    getPremiumPlans();
  }, []);

  return (
    <>
      <Adminnav />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 ">
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6">
          <Sidebar />

          <div
            className="flex-1 bg-white rounded-lg shadow-lg p-6 space-y-4"
            style={{
              height: "80vh",
              overflowY: "auto",
            }}
          >
            <div className="bg-indigo-950 text-white rounded-lg px-6 py-3 flex justify-between items-center">
              <span className="text-lg font-semibold">Premium Plan List</span>
              <button
                className="bg-white hover:bg-blue-100 text-indigo-950 px-4 py-2 rounded-lg text-base font-medium"
                onClick={() => setIsModalOpen(true)}
              >
                Add Premium Plan
              </button>
            </div>

            <div className="space-y-4">
              {subscribedPlan ? (  
                <div className="p-6 flex items-center shadow-md border rounded-lg">
                  <div className="flex items-center space-x-3 w-1/3">
                    <div>
                      <h3 className="font-medium text-sm">{subscribedPlan.planName}</h3>
                      <p className="text-xs">Duration: {subscribedPlan.Duration} months</p>
                      <p className="text-xs">Price: ${subscribedPlan.planPrice}</p>
                      <p className="text-xs">Description: {subscribedPlan.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                premiumPlans.map((plan) => (
                  <div
                    key={plan._id}
                    className="p-6 flex items-center shadow-md border rounded-lg"
                    style={{
                      height: "4rem",
                    }}
                  >
                    <div className="flex items-center space-x-3 w-1/3">
                      <div>
                        <h3 className="font-medium text-sm">{plan.planName}</h3>
                        <p className="text-xs">Duration: {plan.Duration} months</p>
                        <p className="text-xs">Price: ${plan.planPrice}</p>
                        <p className="text-xs">Description: {plan.description}</p>
                      </div>
                    </div>

                    <div className="ml-auto flex space-x-2">
                      <button
                        className={`${
                          plan.is_Listed ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        } text-white px-4 py-2 rounded-lg text-sm font-medium`}
                      >
                        {plan.is_Listed ? "Unlist" : "List"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full sm:w-96">
            <PaymentForm plan={subscribedPlan || premiumPlans[0]} setIsModalOpen={setIsModalOpen} />
          </div>
        </div>
      )}
    </>
  );
};

export default PremiumPlans;


