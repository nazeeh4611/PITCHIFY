import React, { useState } from 'react';
import { User, MessageSquare, Star, ChevronRight, CreditCard, Briefcase } from 'lucide-react';

const Sidebar = ({ onSectionChange }) => {
  const [active, setActive] = useState('profile');

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'reviews', icon: Star, label: 'Rate & Review' },
    { id: 'subscription', icon: CreditCard, label: 'Subscription' },
    { id: 'business-model', icon: Briefcase, label: ' Models' } // Added Business Model menu item
  ];

  const handleClick = (id) => {
    setActive(id);
    if (onSectionChange) {
      onSectionChange(id);
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

export default Sidebar;
