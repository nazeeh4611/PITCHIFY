import React, { useState, useEffect } from 'react';
import { User, MessageSquare, CreditCard, Save, Crown, Briefcase, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { InvestorAuth } from '../../Redux/InvestorTokenSlice';

const InvestorSidebar = ({ onSectionChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [active, setActive] = useState('profile');

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile', path: '/investor/profile' },
    { id: 'chat', icon: MessageSquare, label: 'Chat', path: '/investor/chat' },
    { id: 'subscription', icon: CreditCard, label: 'Subscription', path: '/investor/premium' },
    { id: 'savedModels', icon: Save, label: 'Saved Models', path: '/investor/savedmodels' },
    { id: 'exclusiveModels', icon: Crown, label: 'Exclusive Models', path: '/investor/exclusivemodels' },
    { id: 'investorDetails', icon: Briefcase, label: 'Investor Details', path: '/investor/investordetails' },
  ];

  // Update active state based on current path when component mounts or route changes
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find(item => currentPath === item.path);
    
    if (activeItem) {
      setActive(activeItem.id);
      if (onSectionChange) {
        onSectionChange(activeItem.id);
      }
    }
  }, [location.pathname, onSectionChange]);

  const handleClick = (id) => {
    setActive(id);
    if (onSectionChange) {
      onSectionChange(id);
    }
    
    const item = menuItems.find(item => item.id === id);
    if (item) {
      navigate(item.path);
    } else {
      console.warn('Invalid menu item:', id);
    }
  };

  const handleLogout = () => {
    dispatch(InvestorAuth({ token: "" }));
    navigate('/');
  };

  return (
    <div className="w-64 bg-[#00186E] rounded-lg shadow p-4 h-full">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              active === item.id
                ? 'bg-white text-[#00186E]' 
                : 'hover:bg-[#00186E] hover:text-white' 
            }`}
          >
            <item.icon className={`w-5 h-5 ${active === item.id ? 'text-[#00186E]' : 'text-white'}`} />
            <span className={`flex-1 text-left ${active === item.id ? 'text-[#00186E]' : 'text-white'}`}>
              {item.label}
            </span>
            <ChevronRight className={`w-4 h-4 ${active === item.id ? 'text-[#00186E]' : 'text-white'}`} />
          </button>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors mt-auto border-t border-white/20 hover:bg-white group"
      >
        <LogOut className="w-5 h-5 text-white group-hover:text-red-600" />
        <span className="flex-1 text-left text-white group-hover:text-red-600">Logout</span>
        <ChevronRight className="w-4 h-4 text-white group-hover:text-red-600" />
      </button>
    </div>
  );
};

export default InvestorSidebar;