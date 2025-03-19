import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Users, UserCircle, Bookmark, Grid, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleIconClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const getButtonClass = (path: string) => {
    // Check if current path is the exact match
    if (location.pathname === path) {
      return 'bg-white text-[#2D2654]';
    }
    
    if (path === '/admin/entrepreneurlist' && 
        (location.pathname.startsWith('/admin/entrepreneurlist/') || 
         location.pathname.includes('/admin/model/'))) {
      return 'bg-white text-[#2D2654]';
    }
    if (path === '/admin/investorlist' && 
        (location.pathname.startsWith('/admin/investor-details/'))) {
      return 'bg-white text-[#2D2654]';
    }
    
    return 'hover:bg-[#3D3464] text-white';
  };

  return (
    <div
      className="bg-[#2D2654] p-4 rounded-lg shadow-md flex flex-col items-start space-y-6 h-full w-full"
      style={{ minHeight: '80vh' }}
    >
      <button
        className={`w-full flex items-center space-x-4 p-3 rounded-lg ${getButtonClass('/admin/dashboard')}`}
        onClick={() => handleIconClick('/admin/dashboard')}
      >
        <TrendingUp className="w-5 h-5" />
        <span className="font-medium">Dashboard</span>
      </button>
      <button
        className={`w-full flex items-center space-x-4 p-3 rounded-lg ${getButtonClass('/admin/investorlist')}`}
        onClick={() => handleIconClick('/admin/investorlist')}
      >
        <Users className="w-5 h-5" />
        <span className="font-medium">Investor</span>
      </button>
      <button
        className={`w-full flex items-center space-x-4 p-3 rounded-lg ${getButtonClass('/admin/entrepreneurlist')}`}
        onClick={() => handleIconClick('/admin/entrepreneurlist')}
      >
        <UserCircle className="w-5 h-5" />
        <span className="font-medium">Entrepreneur</span>
      </button>
      <button
        className={`w-full flex items-center space-x-4 p-3 rounded-lg ${getButtonClass('/admin/subscription')}`}
        onClick={() => handleIconClick('/admin/subscription')}
      >
        <Bookmark className="w-5 h-5" />
        <span className="font-medium">Subscription</span>
      </button>
      <button
        className={`w-full flex items-center space-x-4 p-3 rounded-lg ${getButtonClass('/admin/category')}`}
        onClick={() => handleIconClick('/admin/category')}
      >
        <Grid className="w-5 h-5" />
        <span className="font-medium">Category</span>
      </button>
      <div className="flex-grow"></div>
      <button
        className="w-full flex items-center space-x-4 p-3 rounded-lg text-white hover:bg-red-600 mt-auto"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;