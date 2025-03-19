import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import Adminnav from "./Adminnav";
import { baseurl } from '../../Constent/regex';
import PaymentForm from "../Common/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

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

const stripePromise = loadStripe("your_stripe_publishable_key");

const PremiumPlans: React.FC = () => {
    const [premiumPlans, setPremiumPlans] = useState<FetchedPremiumPlan[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [newPremiumPlan, setNewPremiumPlan] = useState<PremiumPlanState>({
        planName: "",
        Duration: 0,
        planPrice: 0,
        description: "",
    });
    const [editPremiumPlan, setEditPremiumPlan] = useState<FetchedPremiumPlan | null>(null);
    const [subscribedPlan, setSubscribedPlan] = useState<FetchedPremiumPlan | null>(null);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPremiumPlan(prev => ({
            ...prev,
            [name]: name === 'Duration' || name === 'planPrice' ? parseFloat(value) : value
        }));
    };

    const handleAddPlan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const api = axios.create({
                baseURL: baseurl,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin")}`,
                },
            });

            await api.post("/admin/add-plan", newPremiumPlan);
            setIsAddPlanModalOpen(false);
            setNewPremiumPlan({
                planName: "",
                Duration: 0,
                planPrice: 0,
                description: "",
            });
            getPremiumPlans();
        } catch (error) {
            console.error("Error adding premium plan:", error);
        }
    };

    useEffect(() => {
        getPremiumPlans();
    }, []);

    return (
        <>
            <Adminnav toggleSidebar={toggleSidebar} />

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
                        <div className="bg-indigo-950 text-white rounded-lg px-6 py-3 flex justify-between items-center">
                            <span className="text-lg font-semibold">Premium Plan List</span>
                            <button
                                className="bg-white hover:bg-blue-100 text-indigo-950 px-4 py-2 rounded-lg text-base font-medium"
                                onClick={() => setIsAddPlanModalOpen(true)}
                            >
                                Add Premium Plan
                            </button>
                        </div>

                        <div className="space-y-4">
                            {subscribedPlan ? (  
                                <div className="p-2 flex flex-col sm:flex-row items-start sm:items-center shadow-md border rounded-lg">
                                    <div className="flex items-center space-x-3 w-full sm:w-1/3 mb-2 sm:mb-0">
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
                                        className="p-2 flex flex-col sm:flex-row items-start sm:items-center shadow-md border rounded-lg"
                                        style={{
                                            minHeight: "4rem",
                                        }}
                                    >
                                        <div className="flex items-center space-x-3 w-full sm:w-2/3 mb-2 sm:mb-0">
                                            <div>
                                                <h3 className="font-medium text-sm">{plan.planName}</h3>
                                                <p className="text-xs">Duration: {plan.Duration} months</p>
                                                <p className="text-xs">Price: ${plan.planPrice}</p>
                                                <p className="text-xs">Description: {plan.description}</p>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-1/3 flex justify-start sm:justify-end space-x-2">
                                            <button
                                                className={`px-4 py-1 rounded-lg text-white text-sm font-medium ${
                                                    plan.is_Listed ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                                }`}
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
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
                        <Elements stripe={stripePromise}>
                            <PaymentForm plan={subscribedPlan || premiumPlans[0]} setIsModalOpen={setIsModalOpen} />
                        </Elements>
                    </div>
                </div>
            )}

            {isAddPlanModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
                        <h2 className="text-xl font-semibold mb-4">Add New Premium Plan</h2>
                        <form onSubmit={handleAddPlan}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                                <input
                                    type="text"
                                    name="planName"
                                    value={newPremiumPlan.planName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                                <input
                                    type="number"
                                    name="Duration"
                                    value={newPremiumPlan.Duration}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    name="planPrice"
                                    value={newPremiumPlan.planPrice}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={newPremiumPlan.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={3}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                    onClick={() => setIsAddPlanModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Add Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default PremiumPlans;