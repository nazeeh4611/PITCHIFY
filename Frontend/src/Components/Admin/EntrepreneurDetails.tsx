import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageCircle, ExternalLink, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import axios from 'axios';
import Adminnav from './Adminnav';
import { baseurl } from '../../Constent/regex';

interface BusinessModel {
  _id: string;
  businessName: string;
  tagline: string;
  industryFocus: string | { categoryname: string; image: string };
  location: string;
  marketOpportunities: string;
  fundinggoal: string;
  rating?: number;
  pitchvideo: string;
  postedDate: string;
  problemStatement: string;
  solution: string;
  targetAudience: string;
  useOfFunds: string;
  uploadedentrepreneur: string;
}

const BusinessModelCard: React.FC<{ model: BusinessModel }> = ({ model }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/admin/model/${model._id}`);
  };
  
  const categoryName = typeof model.industryFocus === 'object' 
    ? model.industryFocus.categoryname 
    : 'Unknown';
  
  const rating = model.rating || 0;
  
  return (
    <div className="bg-white rounded-2xl px-4 sm:px-6 md:px-8 py-4 md:py-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 md:gap-8">
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-3 sm:gap-0">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-indigo-700 transition-colors">
                {model.businessName}
              </h2>
              <p className="text-gray-600 mt-1 sm:mt-2 font-medium text-base sm:text-lg">{model.tagline}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 sm:p-3 hover:bg-indigo-50 rounded-xl transition-colors">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6">
            <div className="text-indigo-700 bg-indigo-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-sm">
              {categoryName}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-gray-600 text-sm sm:text-base font-medium">
              <span>📍</span>
              {model.location}
            </div>
            {rating > 0 && (
              <div className="flex items-center bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm">
                <span className="font-semibold text-gray-900 mr-1 sm:mr-2 text-sm sm:text-base">{rating}</span>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'} text-xs sm:text-sm`}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-5 sm:mt-6">
            <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 text-center sm:text-left">Summary</div>
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-8">
              <p className="text-gray-600 flex-1 line-clamp-3 text-base sm:text-lg leading-relaxed text-center sm:text-left">
                {model.marketOpportunities}
              </p>
              <div className="flex flex-col items-center sm:items-end">
                <div className="bg-gray-50 px-4 py-2.5 rounded-lg shadow-sm">
                  <span className="text-gray-500 block text-xs sm:text-sm text-center sm:text-left">Funding Goal</span>
                  <span className="text-gray-900 font-bold text-base sm:text-lg">
                    ${parseFloat(model.fundinggoal).toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={handleViewDetails} 
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 mt-3 sm:mt-4 font-semibold transition-all duration-300 text-sm sm:text-base shadow-sm"
                >
                  View details <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const EmptyState = () => (
  <div className="bg-white rounded-2xl p-8 sm:p-16 text-center shadow-md border border-gray-100">
    <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
      <ExternalLink className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-700 opacity-70" />
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Models Found</h3>
    <p className="text-gray-600 text-base sm:text-lg max-w-lg mx-auto mb-6">This entrepreneur hasn't uploaded any business models yet.</p>
    <button
      onClick={() => window.history.back()}
      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-950 transition-colors shadow-md inline-flex items-center gap-2"
    >
      Go Back
    </button>
  </div>
);

const EntrepreneurDetails: React.FC = () => {
  const [models, setModels] = useState<BusinessModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const modelsPerPage = 5;
  const navigate = useNavigate();
  const { id } = useParams();
  const [isRendered, setIsRendered] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getEntrepreneurModels = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin')}`,
        },
      });

      const response = await api.get(`/admin/entrepreneurmodels/${id}`);
      
      if (response.data && Array.isArray(response.data)) {
        setModels(response.data);
      } else {
        setModels([]);
      }
    } catch (error) {
      console.error('Error fetching entrepreneur models:', error);
      setModels([]);
    } finally {
      setLoading(false);
      setIsRendered(true);
    }
  };

  useEffect(() => {
    if (id) {
      getEntrepreneurModels();
    }
    
    return () => {
      setIsRendered(false);
    };
  }, [id]);

  const indexOfLastModel = currentPage * modelsPerPage;
  const indexOfFirstModel = indexOfLastModel - modelsPerPage;
  const currentModels = models.slice(indexOfFirstModel, indexOfLastModel);
  const totalPages = Math.ceil(models.length / modelsPerPage);



  return (
    <>
      <Adminnav toggleSidebar={toggleSidebar} />

      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
      
      <div 
        className={`fixed left-0 top-0 h-full w-64 bg-gray-100 z-50 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-16 px-4 h-full">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 p-4 pt-20">
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row w-full max-w-6xl">
          <div className="hidden md:block w-1/4 md:mr-6">
            <Sidebar />
          </div>

          <div
            className="w-full md:flex-1 bg-white rounded-lg shadow-lg p-4 md:p-6"
            style={{
              height: "80vh",
              position: "relative",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Entrepreneur Models</h1>
              <button 
                onClick={() => navigate('/admin/entrepreneurlist')} 
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base shadow-sm flex items-center gap-1 sm:gap-2"
              >
                Back to Entrepreneurs
              </button>
            </div>
            
            {loading ? (
              <div className="space-y-6 flex-1 overflow-hidden">
              </div>
            ) : models.length === 0 ? (
              <div className="flex-1 overflow-hidden flex items-center justify-center">
                <EmptyState />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                  {currentModels.map(model => (
                    <BusinessModelCard key={model._id} model={model} />
                  ))}
                </div>
                
                {models.length > modelsPerPage && (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center items-center gap-2 sm:gap-4 bg-white rounded-2xl p-2 sm:p-3">
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

      {/* <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dadada;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style> */}
    </>
  );
};

export default EntrepreneurDetails;