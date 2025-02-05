import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, MessageSquare, Star, ChevronRight, CreditCard, Briefcase, LogOut } from 'lucide-react';
import { EntrepreneurAuth } from "../../Redux/EntrepreneurTokenSlice";
import { useDispatch } from "react-redux";

const Sidebar = ({ onSectionChange }) => {
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile', path: '/entrepreneur/profile' },
    { id: 'business-model', icon: Briefcase, label: 'Models', path: '/entrepreneur/models' },
    { id: 'chat', icon: MessageSquare, label: 'Chat', path: '/entrepreneur/chat' },
    { id: 'reviews', icon: Star, label: 'Rate & Review', path: '/entrepreneur/rate-review' },
    { id: 'subscription', icon: CreditCard, label: 'Subscription', path: '/entrepreneur/premium' },
  ];
  const dispatch = useDispatch();

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) => item.path === currentPath);
    setActive(activeItem ? activeItem.id : '');
  }, [location.pathname]);

  const handleClick = (id, path) => {
    setActive(id);
    if (onSectionChange) {
      onSectionChange(id);
    }
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(EntrepreneurAuth({ token: "" }));

    navigate('/');
  };

  return (
    <div className="w-64 bg-[#00186E] rounded-lg shadow p-4 h-full flex flex-col">
      <nav className="space-y-2 flex-grow">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id, item.path)}
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
      
      {/* Logout button */}
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

export default Sidebar;