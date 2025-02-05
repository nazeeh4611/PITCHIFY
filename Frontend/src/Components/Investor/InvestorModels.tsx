import React, { useEffect, useState, useRef } from 'react';
import { Search, MessageCircle, Bookmark, ArrowLeft, ExternalLink, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../Layout/Navbar";
import logo from "../Layout/Image/logo.jpeg";
import axios from 'axios';
import { baseurl } from '../../Constent/regex';
import Footer from '../Layout/Footer';
import shortlogo from "../Layout/Image/shortlogo.png"

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
}

interface BusinessCardProps {
  model: BusinessModel;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ model }) => {

  const navigate = useNavigate()
  const handleLearnmore = async()=>{
    try {
      navigate(`/investor/model-details/${model.id}`);
    } catch (error) {
      
    }
  }
  return (
    <div className="bg-white rounded-2xl px-8 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300 border border-gray-100">
      <div className="flex items-start gap-8">
        <div className="flex-shrink-0">
          <img
            src={model.image}
            alt={model.name}
            className="w-24 h-24 rounded-xl object-cover shadow-md"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 hover:text-indigo-900 transition-colors">
                {model.name}
              </h2>
              <p className="text-gray-600 mt-2 font-medium text-lg">{model.company}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 hover:bg-indigo-50 rounded-xl transition-colors">
                <MessageCircle className="w-6 h-6 text-indigo-900" />
              </button>
              <button className="p-3 hover:bg-indigo-50 rounded-xl transition-colors">
                <Bookmark className="w-6 h-6 text-indigo-900" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-8 mt-6">
            <div className="text-indigo-900 bg-indigo-50 px-4 py-2 rounded-lg text-sm font-semibold">
              {model.category}
            </div>
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <span>📍</span>
              {model.location}
            </div>
            <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
              <span className="font-semibold text-gray-900 mr-2">{model.rating}</span>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`${i < Math.floor(model.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-sm font-semibold text-gray-700 mb-3">Summary</div>
            <div className="flex justify-between items-start gap-8">
              <p className="text-gray-600 flex-1 line-clamp-3 text-lg leading-relaxed">
                {model.summary}
              </p>
              <div className="flex flex-col items-end">
                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="text-gray-500 block text-sm">Funding Goal</span>
                  <span className="text-gray-900 font-bold text-lg">
                    ${model.fundingGoal.toLocaleString()}
                  </span>
                </div>
                <button onClick={handleLearnmore} className="text-indigo-900 hover:text-indigo-700 flex items-center gap-2 mt-4 font-semibold transition-colors">
                  Learn more <ExternalLink className="w-5 h-5" />
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const modelsPerPage = 10;

  const getModels = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const categoryId = queryParams.get('category');
      
      const response = await axios.post(`${baseurl}/investor/models`, {
        category: categoryId,
      });
      
      const fetchedModels = response.data.map((item: any) => ({
        id: item._id,
        name: item.businessName,
        company: item.company || '',
        category: item.industryFocus.categoryname,
        location: item.location || 'Unknown',
        summary: item.marketOpportunities,
        fundingGoal: parseFloat(item.fundinggoal),
        rating: item.rating || 0,
        image: item.industryFocus.image || '',
      }));
      
      setModels(fetchedModels);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  useEffect(() => {
    getModels();
  }, [location.search]);

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
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
      
      <div id="search-section" className="bg-gray-50 pb-6 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">


            
              {/* <button className="p-2 hover:bg-indigo-50 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button> */}
            </div>
            
            
            <div className="relative max-w-3xl w-full mx-auto flex gap-2">
            {/* <button 
  onClick={() => navigate(-1)}
  className="flex items-center gap-8 text-gray-600 hover:text-indigo-900 transition-colors group px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100 "
>
  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
  <span className="font-medium">Back</span>
</button> */}
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search business models..."
                className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 text-lg transition-colors placeholder:text-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="p-4 bg-[#2A1B5D] hover:bg-[#231648] rounded-xl transition-all group flex-shrink-0">
                <Search className="w-6 h-6 text-white" />
              </button>
              
            </div>
          </div>
        </div>
      </div>

      {showFloatingSearch && (
        <button
          onClick={scrollToSearch}
          className="fixed bottom-6 right-6 p-4 bg-[#2A1B5D] hover:bg-[#231648] rounded-xl shadow-lg transition-all transform hover:scale-110 z-50"
        >
          <Search className="w-6 h-6 text-white" />
        </button>
      )}

      <div className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="pt-8">
            {filteredModels.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-gray-100">
                <p className="text-gray-600 text-xl">No business models found matching your search.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentModels.map((model) => (
                  <BusinessCard key={model.id} model={model} />
                ))}
              </div>
            )}

            {filteredModels.length > 0 && (
              <div className="mt-12 mb-8 flex justify-center items-center gap-4 bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-gray-100">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-indigo-900" />
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all ${
                        currentPage === index + 1
                          ? 'bg-indigo-900 text-white scale-105 shadow-md'
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
                  className="p-3 rounded-xl hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-indigo-900" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BusinessModelsPage;