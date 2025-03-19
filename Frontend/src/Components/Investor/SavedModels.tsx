import React, { useEffect, useState } from 'react';
import { MessageCircle, Bookmark, ExternalLink, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Layout/Navbar";
import logo from "../Layout/Image/logo.jpeg";
import shortlogo from "../Layout/Image/shortlogo.png";
import Sidebar from './InvestorSidebar';
import Footer from '../Layout/Footer';
import axios from 'axios';
import { baseurl } from '../../Constent/regex';
import { useGetToken } from '../../token/Gettoken';

interface SavedBusinessModel {
  id: string;
  name: string;
  company: string;
  category: string;
  location: string;
  summary: string;
  fundingGoal: number;
  rating: number;
  image: string;
  saved: boolean;
}

const SavedBusinessCard: React.FC<{
  model: SavedBusinessModel;
  onUnsave: (modelId: string) => void;
}> = ({ model, onUnsave }) => {
  const navigate = useNavigate();
  
  const handleLearnMore = () => {
    navigate(`/investor/model-details/${model.id}`);
  };
  
  const handleUnsaveModel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUnsave(model.id);
  };
  
  return (
    <div className="bg-white rounded-2xl px-4 sm:px-6 md:px-8 py-4 md:py-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 md:gap-8">
        {/* <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
          <img
            src={model.image || "/api/placeholder/200/200"}
            alt={model.name}
            className="w-full h-full object-cover"
          />
        </div> */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-3 sm:gap-0">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-indigo-700 transition-colors">
                {model.name}
              </h2>
              <p className="text-gray-600 mt-1 sm:mt-2 font-medium text-base sm:text-lg">{model.company}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 sm:p-3 hover:bg-indigo-50 rounded-xl transition-colors">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700" />
              </button>
              <button 
                className="p-2 sm:p-3 hover:bg-indigo-50 rounded-xl transition-colors bg-indigo-50"
                onClick={handleUnsaveModel}
              >
                <Bookmark 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-900 fill-indigo-700"
                />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6">
            <div className="text-indigo-700 bg-indigo-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-sm">
              {model.category}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-gray-600 text-sm sm:text-base font-medium">
              <span>📍</span>
              {model.location}
            </div>
            <div className="flex items-center bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm">
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
            <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 text-center sm:text-left">Summary</div>
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-8">
              <p className="text-gray-600 flex-1 line-clamp-3 text-base sm:text-lg leading-relaxed text-center sm:text-left">
                {model.summary}
              </p>
              <div className="flex flex-col items-center sm:items-end">
                <div className="bg-gray-50 px-4 py-2.5 rounded-lg shadow-sm">
                  <span className="text-gray-500 block text-xs sm:text-sm text-center sm:text-left">Funding Goal</span>
                  <span className="text-gray-900 font-bold text-base sm:text-lg">
                    ${model.fundingGoal.toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={handleLearnMore} 
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 mt-3 sm:mt-4 font-semibold transition-all duration-300 text-sm sm:text-base shadow-sm"
                >
                  Learn more <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="animate-pulse bg-white rounded-2xl px-4 sm:px-6 md:px-8 py-4 md:py-5 shadow-md border border-gray-100">
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 md:gap-8">
      <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-200"></div>
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-3 sm:gap-0">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <div className="h-7 sm:h-8 bg-gray-200 rounded-lg w-48 mb-2"></div>
            <div className="h-5 sm:h-6 bg-gray-200 rounded-lg w-32"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6">
          <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-28 bg-gray-200 rounded-lg"></div>
        </div>
        
        <div className="mt-5 sm:mt-6">
          <div className="h-4 w-16 bg-gray-200 rounded mb-2 sm:mb-3"></div>
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-8">
            <div className="h-16 bg-gray-200 rounded-lg w-full sm:w-2/3"></div>
            <div className="flex flex-col items-center sm:items-end">
              <div className="h-16 w-32 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-28 bg-gray-200 rounded-lg mt-3 sm:mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="bg-white rounded-2xl p-8 sm:p-16 text-center shadow-md border border-gray-100">
    <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
      <Bookmark className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-700 opacity-70" />
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Saved Models</h3>
    <p className="text-gray-600 text-base sm:text-lg max-w-lg mx-auto mb-6">You haven't saved any business models yet. Browse models and save them to review later.</p>
    <button
      onClick={() => window.location.href = '/investor/models'}
      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-950 transition-colors shadow-md inline-flex items-center gap-2"
    >
      Browse Models <ExternalLink className="w-4 h-4" />
    </button>
  </div>
);

const InvestorSavedModels: React.FC = () => {
  const [savedModels, setSavedModels] = useState<SavedBusinessModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const modelsPerPage = 5;
  const token = useGetToken("investor");
  const email = token?.email;
  const navigate = useNavigate();
  
  const api = axios.create({
    baseURL: baseurl
  });
  
  const fetchSavedModels = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await api.post('/investor/profile', {
        email
      });
      
      const investorData = response.data.investor.Investor;
      
      if (investorData.savedmodel && Array.isArray(investorData.savedmodel)) {
        const modelDetailsPromises = investorData.savedmodel.map(async (modelData: any) => {
          const modelId = typeof modelData === 'object' ? modelData._id : modelData;
          
          if (typeof modelData === 'object' && modelData.businessName) {
            const categoryName = typeof modelData.industryFocus === 'object' 
              ? modelData.industryFocus.categoryname 
              : 'Unknown';
              
            const categoryImage = typeof modelData.industryFocus === 'object'
              ? modelData.industryFocus.image
              : '';
              
            return {
              id: modelData._id,
              name: modelData.businessName,
              company: modelData.company || '',
              category: categoryName,
              location: modelData.location || 'Unknown',
              summary: modelData.marketOpportunities || 'No description available',
              fundingGoal: parseFloat(modelData.fundinggoal) || 0,
              rating: modelData.rating || 0,
              image: categoryImage,
              saved: true
            };
          } else {
            try {
              const modelResponse = await api.get(`/investor/model/${modelId}`);
              const model = modelResponse.data;
              
              return {
                id: model._id,
                name: model.businessName,
                company: model.company || '',
                category: typeof model.industryFocus === 'object' ? model.industryFocus.categoryname : 'Unknown',
                location: model.location || 'Unknown',
                summary: model.marketOpportunities || 'No description available',
                fundingGoal: parseFloat(model.fundinggoal) || 0,
                rating: model.rating || 0,
                image: typeof model.industryFocus === 'object' ? model.industryFocus.image : '',
                saved: true
              };
            } catch (error) {
              console.error(`Error fetching details for model ${modelId}:`, error);
              return null;
            }
          }
        });
        
        const modelDetails = await Promise.all(modelDetailsPromises);
        setSavedModels(modelDetails.filter(Boolean) as SavedBusinessModel[]);
      } else {
        setSavedModels([]);
      }
    } catch (error) {
      console.error('Error fetching saved models:', error);
      setSavedModels([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnsaveModel = async (modelId: string) => {
    if (!email) return;
    
    try {
      await api.post(`/investor/unsave-model`, {
        email,
        modelId,
        model: modelId
      });
      
      setSavedModels(prev => prev.filter(model => model.id !== modelId));
    } catch (error) {
      console.error('Error unsaving model:', error);
    }
  };

  useEffect(()=>{
    fetchSavedModels()
  },[])
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

      const indexOfLastModel = currentPage * modelsPerPage;
      const indexOfFirstModel = indexOfLastModel - modelsPerPage;
      const currentModels = savedModels.slice(indexOfFirstModel, indexOfLastModel);
      const totalPages = Math.ceil(savedModels.length / modelsPerPage);
    
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
          
          <div className="flex-1 flex justify-center items-center bg-gray-100 p-2 sm:p-4 overflow-hidden">
        <div
          className="bg-white rounded-[2%] shadow-lg p-1 sm:p-2 md:p-4 flex flex-col md:flex-row w-full max-w-full sm:max-w-full md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] h-[80vh] overflow-hidden"
          style={{ maxHeight: "80vh" }}
        >
              <div className="md:hidden absolute top-2 left-2 z-20">
                <button 
                  onClick={toggleSidebar}
                  className="p-2 text-[#1e1b4b] rounded-lg hover:bg-gray-100"
                >
                  {showSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
    
              <div 
                className={`${showSidebar ? 'block' : 'hidden'} md:block absolute md:relative z-10 bg-white w-3/4 md:w-1/4 min-h-10 border-r border-gray-200`}
              >
                <Sidebar onSectionChange={(id) => console.log(id)} />
              </div>
    
              <div className="w-full md:w-3/4 flex flex-col md:pl-6 mt-12 md:mt-0">
                <div className="bg-white border-0 p-4 sm:p-6 w-full h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Models</h1>
                    <button 
                      onClick={() => navigate('/investor/models')} 
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base shadow-sm flex items-center gap-1 sm:gap-2"
                    >
                      Browse All <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-6 overflow-y-auto flex-grow" style={{ maxHeight: "calc(90vh - 200px)" }}>
                      {[...Array(3)].map((_, index) => (
                        <SkeletonLoader key={index} />
                      ))}
                    </div>
                  ) : savedModels.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <>
                      <div className="space-y-6 overflow-y-auto flex-grow" style={{ maxHeight: "calc(90vh - 200px)" }}>
                        {currentModels.map(model => (
                          <SavedBusinessCard 
                            key={model.id} 
                            model={model} 
                            onUnsave={handleUnsaveModel} 
                          />
                        ))}
                      </div>
                      
                      {savedModels.length > modelsPerPage && (
                        <div className="mt-6 mb-4 flex justify-center items-center gap-2 sm:gap-4 bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-gray-100 sticky bottom-0">
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      );
    };
    
    export default InvestorSavedModels;