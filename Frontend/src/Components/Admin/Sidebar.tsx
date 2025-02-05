import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Users, UserCircle, Bookmark, Grid } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleIconClick = (path: string) => {
    navigate(path);
  };

  const getButtonClass = (path: string) => {
    return location.pathname === path
      ? 'bg-white text-[#2D2654]' // active
      : 'hover:bg-[#3D3464] text-white'; // inactive
  };

  return (
    <div
      className="bg-[#2D2654] p-4 rounded-lg shadow-md flex flex-col items-start space-y-6 h-full w-1/4"
      style={{ minHeight: '80vh' }}
    >
      <button
        className={`w-full flex items-center space-x-4 p-3 rounded-lg ${getButtonClass('/admin/revenue')}`}
        onClick={() => handleIconClick('/revenue')}
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
    </div>
  );
};

export default Sidebar;
