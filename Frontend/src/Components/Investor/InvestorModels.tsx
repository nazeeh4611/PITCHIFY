import React, { useEffect, useState, useRef } from 'react';
import { Search, MessageCircle, Bookmark, ArrowLeft, ExternalLink, Filter, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../Layout/Navbar";
import logo from "../Layout/Image/logo.jpeg";
import axios from 'axios';
import { baseurl } from '../../Constent/regex';
import Footer from '../Layout/Footer';
import shortlogo from "../Layout/Image/shortlogo.png"
import { useGetToken } from '../../token/Gettoken';
import { Investor } from '../../Interfacetypes/types';

interface BusinessModel {
  id: string;
  name: string;
  company: string;
  category: string;
  location: string;
  summary: string;
  fundingGoal: number;
  rating: number;
  image: string;
  locked?: boolean;
}

interface BusinessCardProps {
  model: BusinessModel;
  hasPremium: boolean;
  onPremiumRequired: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ model, hasPremium, onPremiumRequired }) => {
  const navigate = useNavigate();
  
  const handleLearnmore = async() => {
    if (model.locked && !hasPremium) {
      onPremiumRequired();
      return;
    }
    
    try {
      navigate(`/investor/model-details/${model.id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }
  
  return (
    <div className={`bg-white rounded-2xl px-4 sm:px-6 md:px-8 py-4 md:py-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 ${model.locked && !hasPremium ? 'relative overflow-hidden' : ''}`}>
      {model.locked && !hasPremium && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white px-2 sm:px-3 py-1 rounded-bl-xl flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium z-10">
          <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
          Premium Only
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 md:gap-8">
        <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
          <img
            src={model.image}
            alt={model.name}
            className={`w-full h-full object-cover ${model.locked && !hasPremium ? 'opacity-70 blur-[1px]' : ''}`}
          />
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-3 sm:gap-0">
            <div className="text-center sm:text-left">
              <h2 className={`text-xl sm:text-2xl font-bold text-gray-900 hover:text-indigo-700 transition-colors ${model.locked && !hasPremium ? 'opacity-80' : ''}`}>
                {model.name}
              </h2>
              <p className={`text-gray-600 mt-1 sm:mt-2 font-medium text-base sm:text-lg ${model.locked && !hasPremium ? 'opacity-80' : ''}`}>{model.company}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 sm:p-3 hover:bg-indigo-50 rounded-xl transition-colors">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700" />
              </button>
              <button className="p-2 sm:p-3 hover:bg-indigo-50 rounded-xl transition-colors">
                <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6">
            <div className={`text-indigo-700 bg-indigo-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold ${model.locked && !hasPremium ? 'opacity-80' : ''} shadow-sm`}>
              {model.category}
            </div>
            <div className={`flex items-center gap-1 sm:gap-2 text-gray-600 text-sm sm:text-base font-medium ${model.locked && !hasPremium ? 'opacity-80' : ''}`}>
              <span>📍</span>
              {model.location}
            </div>
            <div className={`flex items-center bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg ${model.locked && !hasPremium ? 'opacity-80' : ''} shadow-sm`}>
              <span className="font-semibold text-gray-900 mr-1 sm:mr-2 text-sm sm:text-base">{model.rating}</span>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`${i < Math.floor(model.rating) ? 'text-yellow-400' : 'text-gray-200'} text-xs sm:text-sm`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-5 sm:mt-6">
            <div className={`text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 text-center sm:text-left ${model.locked && !hasPremium ? 'opacity-80' : ''}`}>Summary</div>
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-8">
              <p className={`text-gray-600 flex-1 line-clamp-3 text-base sm:text-lg leading-relaxed text-center sm:text-left ${model.locked && !hasPremium ? 'opacity-80' : ''}`}>
                {model.locked && !hasPremium 
                  ? `${model.summary.substring(0, 80)}...` 
                  : model.summary}
              </p>
              <div className="flex flex-col items-center sm:items-end">
                <div className={`bg-gray-50 px-4 py-2.5 rounded-lg ${model.locked && !hasPremium ? 'opacity-80' : ''} shadow-sm`}>
                  <span className="text-gray-500 block text-xs sm:text-sm text-center sm:text-left">Funding Goal</span>
                  <span className="text-gray-900 font-bold text-base sm:text-lg">
                    ${model.fundingGoal.toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={handleLearnmore} 
                  className={`bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 mt-3 sm:mt-4 font-semibold transition-all duration-300 text-sm sm:text-base shadow-sm ${model.locked && !hasPremium ? 'flex items-center gap-2' : ''}`}
                >
                  {model.locked && !hasPremium ? (
                    <>Unlock <Lock className="w-3 h-3 sm:w-4 sm:h-4" /></>
                  ) : (
                    <>Learn more <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BusinessModelsPage: React.FC = () => {
  const [models, setModels] = useState<BusinessModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const modelsPerPage = 10;
  const [profile, setProfile] = useState<Partial<Investor>>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    premium: undefined
  }); 
  const token = useGetToken("investor");
  const email = token?.email;
  
  const hasPremium = profile.premium ? Object.keys(profile.premium).length > 0 : false;
  const getModels = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const categoryId = queryParams.get('category');
      
      const response = await axios.post(`${baseurl}/investor/models`, {
        category: categoryId,
      });
      
      const fetchedModels = response.data.map((item: any, index: number) => ({
        id: item._id,
        name: item.businessName,
        company: item.company || '',
        category: item.industryFocus.categoryname,
        location: item.location || 'Unknown',
        summary: item.marketOpportunities,
        fundingGoal: parseFloat(item.fundinggoal),
        rating: item.rating || 0,
        image: item.industryFocus.image || '',
        locked: index > 0
      }));
      
      setModels(fetchedModels);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const accessData = async () => {
    if (!email) return;
  
    try {
      const response = await axios.post(
        `${baseurl}/investor/profile`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.investor.Investor) {
        setProfile(response.data.investor.Investor);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    accessData();
    getModels();
  }, [location.search, email]);

  useEffect(() => {
    const handleScroll = () => {
      const searchSection = document.getElementById('search-section');
      if (searchSection) {
        const rect = searchSection.getBoundingClientRect();
        setShowFloatingSearch(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSearch = () => {
    searchInputRef.current?.focus();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastModel = currentPage * modelsPerPage;
  const indexOfFirstModel = indexOfLastModel - modelsPerPage;
  const currentModels = filteredModels.slice(indexOfFirstModel, indexOfLastModel);
  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);

  const handlePremiumRequired = () => {
    setShowPremiumModal(true);
  };

  const handleUpgradeToPremium = () => {
    navigate('/investor/pricing');
    setShowPremiumModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      <div className="z-30">
        <Navbar
          logoUrl={logo}
          shortLogoUrl={shortlogo}
          links={[
            { label: "Home", href: "/investor" },
            { label: "About Us", href: "/about-us" },
          ]}
        />
      </div>
      
      <div id="search-section" className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-6 sm:pb-8 pt-6 sm:pt-10 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-5 sm:gap-8">
            <div className="relative max-w-3xl w-full mx-auto">
              <div className="flex w-full rounded-full overflow-hidden shadow-md bg-white">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search business models..."
                  className="w-full px-6 py-4 focus:outline-none text-base sm:text-lg transition-colors placeholder:text-gray-400 border-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="px-5 bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-indigo-950 transition-all group flex-shrink-0 flex items-center justify-center">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFloatingSearch && (
        <button
          onClick={scrollToSearch}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-3 sm:p-4 bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-indigo-950 rounded-full shadow-lg transition-all transform hover:scale-110 z-50"
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      )}

      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            {filteredModels.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 sm:p-16 text-center shadow-md border border-gray-100">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-700 opacity-70" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-gray-600 text-base sm:text-lg max-w-lg mx-auto">We couldn't find any business models matching your search criteria. Try adjusting your search terms.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentModels.map((model) => (
                  <BusinessCard 
                    key={model.id} 
                    model={model} 
                    hasPremium={hasPremium}
                    onPremiumRequired={handlePremiumRequired}
                  />
                ))}
              </div>
            )}

            {filteredModels.length > 0 && (
              <div className="mt-10 sm:mt-12 mb-6 sm:mb-8 flex justify-center items-center gap-2 sm:gap-4 bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 sm:p-3 rounded-xl hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700" />
                </button>
                
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl font-medium transition-all text-sm sm:text-base ${
                        currentPage === index + 1
                          ? 'bg-gradient-to-r from-indigo-700 to-indigo-900 text-white scale-105 shadow-md'
                          : 'hover:bg-indigo-50 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 sm:p-3 rounded-xl hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl transform transition-transform animate-fadeIn">
            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-inner">
                <Lock className="w-7 h-7 sm:w-9 sm:h-9 text-indigo-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Premium Content Locked</h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Upgrade to our premium plan to access all business models and investment opportunities.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl mb-6 text-sm sm:text-base">
              <h4 className="font-semibold text-indigo-800 mb-3">Premium Benefits:</h4>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="bg-indigo-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-700 text-xs">✓</span>
                  </span>
                  <span>Access to all business models</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-indigo-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-700 text-xs">✓</span>
                  </span>
                  <span>Detailed market analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-indigo-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-700 text-xs">✓</span>
                  </span>
                  <span>Priority communication with founders</span>
                </li>
              </ul>
            </div>
            
            <div className="flex gap-3 sm:gap-4">
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-2.5 sm:py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Maybe Later
              </button>
              <button 
                onClick={handleUpgradeToPremium}
                className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-950 transition-colors text-sm sm:text-base shadow-md"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default BusinessModelsPage;