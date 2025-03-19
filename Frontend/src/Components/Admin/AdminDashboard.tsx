import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import axios from 'axios';
import Adminnav from './Adminnav';
import { baseurl } from '../../Constent/regex';
import { BusinessModel } from '../../Interfacetypes/types';

// Simple SVG Pie Chart Component
const PieChart: React.FC<{
  data: { name: string; value: number; color: string }[];
  size?: number;
}> = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {data.map((item, index) => {
          if (total === 0) return null;
          
          const angle = (item.value / total) * 360;
          const endAngle = startAngle + angle;
          
          // Calculate the path for the slice
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

// Legend Component
const ChartLegend: React.FC<{
  data: { name: string; value: number; color: string }[];
}> = ({ data }) => {
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

const AdminDashboard: React.FC = () => {
  const [model, setModel] = useState<BusinessModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    investors: 0,
    entrepreneurs: 0,
    premiumUsers: 0,
    nonPremiumUsers: 0
  });
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
        premiumUsers: response.data.premiumUserCount || 0,
        nonPremiumUsers: response.data.nonPremiumUserCount || 0
      });
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      // Set some example data for development
      setUserStats({
        investors: 150,
        entrepreneurs: 320,
        premiumUsers: 200,
        nonPremiumUsers: 270
      });
    }
  };

  useEffect(() => {
    if (id) {
      getModelDetails();
    }
    getUserStats();
  }, [id]);

  const userTypeData = [
    { name: "Investors", value: userStats.investors, color: "#0088FE" },
    { name: "Entrepreneurs", value: userStats.entrepreneurs, color: "#00C49F" }
  ];

  const subscriptionData = [
    { name: "Premium Users", value: userStats.premiumUsers, color: "#FFBB28" },
    { name: "Non-Premium Users", value: userStats.nonPremiumUsers, color: "#FF8042" }
  ];

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
                <h2 className="text-xl font-bold mb-4 text-center">Subscription Status</h2>
                <div className="flex flex-col items-center">
                  <PieChart data={subscriptionData} />
                  <ChartLegend data={subscriptionData} />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Total Users: {userStats.premiumUsers + userStats.nonPremiumUsers}
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