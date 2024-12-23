import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, UserCircle, Bookmark } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleIconClick = (icon: string, path: string) => {
    setSelectedIcon(icon); // Set the selected icon to change the background
    navigate(path); // Navigate to the corresponding page
  };

  return (
    <div className="w-1/6 bg-[#2D2654] p-4 flex flex-col items-center space-y-6 h-[60vh] mr-4">
      <div
        className={`p-2 rounded-lg cursor-pointer ${
          selectedIcon === 'trending' ? 'bg-white' : 'hover:bg-[#3D3464]'
        }`}
        onClick={() => handleIconClick('trending', '/revenue')}
      >
        <TrendingUp
          className={`w-5 h-5 ${selectedIcon === 'trending' ? 'text-[#2D2654]' : 'text-white'}`}
        />
      </div>
      <div
        className={`p-2 rounded-lg cursor-pointer ${
          selectedIcon === 'users' ? 'bg-white' : 'hover:bg-[#3D3464]'
        }`}
        onClick={() => handleIconClick('users', '/admin/investorlist')}
      >
        <Users
          className={`w-5 h-5 ${selectedIcon === 'users' ? 'text-[#2D2654]' : 'text-white'}`}
        />
      </div>
      <div
        className={`p-2 rounded-lg cursor-pointer ${
          selectedIcon === 'userCircle' ? 'bg-white' : 'hover:bg-[#3D3464]'
        }`}
        onClick={() => handleIconClick('userCircle', '/admin/entrepreneurlist')}
      >
        <UserCircle
          className={`w-5 h-5 ${selectedIcon === 'userCircle' ? 'text-[#2D2654]' : 'text-white'}`}
        />
      </div>
      <div
        className={`p-2 rounded-lg cursor-pointer ${
          selectedIcon === 'bookmark' ? 'bg-white' : 'hover:bg-[#3D3464]'
        }`}
        onClick={() => handleIconClick('bookmark', '/admin/subscription')}
      >
        <Bookmark
          className={`w-5 h-5 ${selectedIcon === 'bookmark' ? 'text-[#2D2654]' : 'text-white'}`}
        />
      </div>
    </div>
  );
};

export default Sidebar;
