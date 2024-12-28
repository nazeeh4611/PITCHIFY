import React, { useState } from 'react';
import { User, MessageSquare, CreditCard, Save, Crown, Briefcase, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const InvestorSidebar = ({ onSectionChange }) => {
  const [active, setActive] = useState('profile');
  const navigate = useNavigate(); // Initialize the navigate function

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'subscription', icon: CreditCard, label: 'Subscription' },
    { id: 'savedModels', icon: Save, label: 'Saved Models' },
    { id: 'exclusiveModels', icon: Crown, label: 'Exclusive Models' },
    { id: 'investorDetails', icon: Briefcase, label: 'Investor Details' }, // New menu item
  ];

  const handleClick = (id) => {
    setActive(id);
    if (onSectionChange) {
      onSectionChange(id);
    }
    if (id === 'investorDetails') {
      navigate('/investor/investordetails'); // Navigate to the /investordetails route
    }
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
                ? 'bg-white text-[#00186E]' // Selected state: white background and custom indigo text
                : 'hover:bg-[#00186E] hover:text-white' // Hover effect: custom indigo background and white text
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
    </div>
  );
};

export default InvestorSidebar;
