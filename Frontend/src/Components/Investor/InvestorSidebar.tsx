import React, { useState } from 'react';
import { User, MessageSquare, CreditCard, Save, Crown, Briefcase, ChevronRight,LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from "react-redux";
import { InvestorAuth } from '../../Redux/InvestorTokenSlice';
const InvestorSidebar = ({ onSectionChange }) => {
  const [active, setActive] = useState('profile');
  const navigate = useNavigate();

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'subscription', icon: CreditCard, label: 'Subscription' },
    { id: 'savedModels', icon: Save, label: 'Saved Models' },
    { id: 'exclusiveModels', icon: Crown, label: 'Exclusive Models' },
    { id: 'investorDetails', icon: Briefcase, label: 'Investor Details' }, 
  ];
  const dispatch = useDispatch();

  const handleClick = (id) => {
    setActive(id);
    if (onSectionChange) {
      onSectionChange(id);
    }
    switch (id) {
      case 'profile':
        navigate('/investor/profile');
        break;
      case 'chat':
        navigate('/investor/chat');
        break;
      case 'subscription':
        navigate('/investor/premium');
        break;
      case 'savedModels':
        navigate('/investor/savedmodels');
        break;
      case 'exclusiveModels':
        navigate('/investor/exclusivemodels');
        break;
      case 'investorDetails':
        navigate('/investor/investordetails');
        break;
      default:
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
        className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors mt-auto border-t border-white/20  hover:text-[#00186E]"
      >
        <LogOut className="w-5 h-5 text-white" />
        <span className="flex-1 text-left text-white hover:text-red-600">Logout</span>
        <ChevronRight className="w-4 h-4 text-white hover:text-red-600"  />
      </button>
    </div>
  );
};

export default InvestorSidebar;
