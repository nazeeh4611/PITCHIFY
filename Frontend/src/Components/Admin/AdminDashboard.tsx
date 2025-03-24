import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import axios from 'axios';
import Adminnav from './Adminnav';
import { baseurl } from '../../Constent/regex';
import { BusinessModel } from '../../Interfacetypes/types';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: ChartDataItem[];
  size?: number;
}

interface BarChartProps {
  data: ChartDataItem[];
  size?: { width: number; height: number };
}

interface ChartLegendProps {
  data: ChartDataItem[];
}

interface SubscriptionPlan {
  _id: string;
  planName: string;
  users: number;
}

interface UserStats {
  investors: number;
  entrepreneurs: number;
  investorPremium: number;
  entrepreneurPremium: number;
  investorNonPremium: number;
  entrepreneurNonPremium: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {data.map((item, index) => {
          if (total === 0) return null;
          
          const angle = (item.value / total) * 360;
          const endAngle = startAngle + angle;
          
          const x1 = Math.cos((startAngle * Math.PI) / 180) * (size / 2.5);
          const y1 = Math.sin((startAngle * Math.PI) / 180) * (size / 2.5);
          const x2 = Math.cos((endAngle * Math.PI) / 180) * (size / 2.5);
          const y2 = Math.sin((endAngle * Math.PI) / 180) * (size / 2.5);
          
          const largeArc = angle > 180 ? 1 : 0;
          
          const path = [
            `M ${x1} ${y1}`,
            `A ${size / 2.5} ${size / 2.5} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L 0 0`,
            `Z`
          ].join(' ');
          
          const slice = (
            <path
              key={index}
              d={path}
              fill={item.color}
              stroke="#fff"
              strokeWidth="1"
            />
          );
          
          startAngle = endAngle;
          return slice;
        })}
      </g>
    </svg>
  );
};

const ChartLegend: React.FC<ChartLegendProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="flex flex-col gap-2 mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div 
            className="w-4 h-4 mr-2" 
            style={{ backgroundColor: item.color }}
          ></div>
          <span className="text-sm">
            {item.name}: {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
          </span>
        </div>
      ))}
    </div>
  );
};

// Simpler alternative bar chart implementation with div-based bars
const SimpleBarChart: React.FC<{ data: ChartDataItem[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  return (
    <div className="w-full max-w-xs">
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;
        return (
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: item.color 
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [model, setModel] = useState<BusinessModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    investors: 0,
    entrepreneurs: 0,
    investorPremium: 0,
    entrepreneurPremium: 0,
    investorNonPremium: 0,
    entrepreneurNonPremium: 0
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getModelDetails = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin')}`,
        },
      });

      const response = await api.get(`/admin/model-details/${id}`);
      setModel(response.data);
    } catch (error) {
      console.error("Error fetching model details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserStats = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin')}`,
        },
      });

      const response = await api.get('/admin/user-statistics');
      setUserStats({
        investors: response.data.investorCount || 0,
        entrepreneurs: response.data.entrepreneurCount || 0,
        investorPremium: response.data.investorPremium || 0,
        entrepreneurPremium: response.data.entrepreneurPremium || 0,
        investorNonPremium: response.data.investorNonPremium || 0,
        entrepreneurNonPremium: response.data.entrepreneurNonPremium || 0
      });
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      // Fallback data
      setUserStats({
        investors: 7,
        entrepreneurs: 6,
        investorPremium: 2,
        entrepreneurPremium: 1,
        investorNonPremium: 5,
        entrepreneurNonPremium: 5
      });
    }
  };

  const getSubscriptionPlans = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin')}`,
        },
      });

      const response = await api.get('/admin/premium-plan');
      if (response.data && Array.isArray(response.data)) {
        setSubscriptionPlans(response.data);
      } else {
        // Fallback data if API response is not in expected format
        setSubscriptionPlans([
          { _id: '1', planName: 'Monthly', users: 3 },
          { _id: '2', planName: 'Quarterly', users: 5 },
          { _id: '3', planName: 'Half-Yearly', users: 2 }
        ]);
      }
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      // Fallback data
      setSubscriptionPlans([
        { _id: '1', planName: 'Monthly', users: 3 },
        { _id: '2', planName: 'Quarterly', users: 5 },
        { _id: '3', planName: 'Half-Yearly', users: 2 }
      ]);
    }
  };

  useEffect(() => {
    getUserStats();
    getSubscriptionPlans();
    if (id) {
      getModelDetails();
    }
  }, [id]);

  const userTypeData: ChartDataItem[] = [
    { name: "Investors", value: userStats.investors, color: "#0088FE" },
    { name: "Entrepreneurs", value: userStats.entrepreneurs, color: "#00C49F" }
  ];

  const subscriptionData: ChartDataItem[] = [
    { name: "Premium Investors", value: userStats.investorPremium, color: "#FFBB28" },
    { name: "Premium Entrepreneurs", value: userStats.entrepreneurPremium, color: "#FF8042" }
  ];

  const nonPremiumData: ChartDataItem[] = [
    { name: "Non-Premium Investors", value: userStats.investorNonPremium, color: "#8884d8" },
    { name: "Non-Premium Entrepreneurs", value: userStats.entrepreneurNonPremium, color: "#82ca9d" }
  ];

  const colorPalette = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#CDDC39"];
  
  const subscriptionPlanData: ChartDataItem[] = subscriptionPlans.map((plan, index) => ({
    name: plan.planName,
    value: plan.users,
    color: colorPalette[index % colorPalette.length]
  }));

  return (
    <>
      <Adminnav toggleSidebar={toggleSidebar} />
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gray-100 z-50 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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
            className="w-full md:flex-1 bg-white rounded-lg shadow-lg p-4 md:p-6 overflow-y-auto"
            style={{
              height: "80vh"
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4 text-center">User Type Distribution</h2>
                <div className="flex flex-col items-center">
                  <PieChart data={userTypeData} />
                  <ChartLegend data={userTypeData} />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Total Users: {userStats.investors + userStats.entrepreneurs}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4 text-center">Premium Subscription Status</h2>
                <div className="flex flex-col items-center">
                  <PieChart data={subscriptionData} />
                  <ChartLegend data={subscriptionData} />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Total Premium Users: {userStats.investorPremium + userStats.entrepreneurPremium}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4 text-center">Non-Premium Users</h2>
                <div className="flex flex-col items-center">
                  <PieChart data={nonPremiumData} />
                  <ChartLegend data={nonPremiumData} />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Total Non-Premium Users: {userStats.investorNonPremium + userStats.entrepreneurNonPremium}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4 text-center">Subscription Plan Users</h2>
                <div className="flex flex-col items-center py-2">
                  {subscriptionPlans.length > 0 ? (
                    <div className="w-full">
                      <SimpleBarChart data={subscriptionPlanData} />
                      <div className="mt-4">
                        {subscriptionPlanData.map((plan, index) => (
                          <div key={index} className="flex items-center mb-1">
                            <div 
                              className="w-4 h-4 mr-2" 
                              style={{ backgroundColor: plan.color }}
                            ></div>
                            <span className="text-sm">{plan.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 my-10">No subscription plan data available</p>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Total Plans: {subscriptionPlans.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;