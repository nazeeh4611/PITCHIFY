import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useGetToken } from "../../token/Gettoken";
import Sidebar from "./EntrepreneurSidebar";
import axios from "axios";
import logo from "../Layout/Image/logo.jpeg";
import Navbar from "../Layout/Navbar";
import shortlogo from "../Layout/Image/shortlogo.png";
import { baseurl } from "../../Constent/regex";
import { Menu, X } from 'lucide-react';

interface Review {
  _id: string;
  rate: number;
  review: string;
  rated_by: { firstname: string };
  createdAt: string;
}

interface BusinessModel {
  businessName: string;
  reviews: Review[];
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className="text-yellow-500">★</span>
      ))}
      {halfStar && <span className="text-yellow-500">★</span>}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <span key={i} className="text-gray-300">★</span>
      ))}
    </div>
  );
};

const Review: React.FC = () => {
  const location = useLocation();
  const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur";
  const token = useGetToken("entrepreneur");
  const email = token?.email ?? '';
  
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([]);  
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<BusinessModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const getmodel = async () => {
    try {
      setIsLoading(true);
      const api = axios.create({
        baseURL: baseurl,
      });

      const response = await api.post(`/${userType}/models`, { email });
      const models = response.data.businessModels;
      setBusinessModels(models);
    } catch (error) {
      console.error("Error in getmodel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getmodel();
    
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openModal = (model: BusinessModel) => {
    setSelectedModel(model);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedModel(null);
  };

  const ReviewSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 w-48 rounded mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white shadow-md p-4 rounded-lg">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-5 bg-gray-200 w-32 rounded mb-2"></div>
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <div className="h-8 bg-gray-200 w-24 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/entrepreneur" },
          { label: "About Us", href: "/about-us" },
        ]}
      />

      <div className="flex-1 flex justify-center items-center bg-gray-100 p-2 sm:p-4 min-h-screen">
        <div
          className="bg-white rounded-[2%] shadow-lg p-1 sm:p-2 md:p-4 flex flex-col md:flex-row w-full max-w-full sm:max-w-full md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "80vh",
          }}
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
            <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 sm:p-6 w-full h-full">
              <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
                <h2 className="text-xl sm:text-2xl font-bold text-left mb-4 sm:mb-6">Ratings & Reviews</h2>
                
                {isLoading ? (
                  <ReviewSkeleton />
                ) : (
                  <div className="max-h-[450px] overflow-y-auto">
                    {businessModels.length > 0 ? (
                      businessModels.map((model) => (
                        model.reviews && model.reviews.length > 0 && (
                          <div key={model.businessName} className="mb-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white shadow-md p-4 rounded-lg mb-4">
                              <div className="flex items-start sm:items-center gap-4">
                                <img
                                  src={`https://via.placeholder.com/50`}
                                  alt={model.businessName}
                                  className="w-12 h-12 rounded-full"
                                />
                                <div>
                                  <h3 className="font-semibold text-lg sm:text-xl">{model.businessName}</h3>
                                </div>
                              </div>
                              <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row items-center sm:items-end gap-4">
                                <button
                                  onClick={() => openModal(model)}
                                  className="bg-[#1e1b4b] text-white py-2 px-4 rounded-md"
                                >
                                  Show Reviews
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No reviews available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedModel && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-lg sm:max-w-2xl md:max-w-4xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">{selectedModel.businessName} Reviews</h2>
            <div className="max-h-[50vh] overflow-y-auto mb-4">
              {selectedModel.reviews.map((review) => (
                <div key={review._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white shadow-md p-4 rounded-lg mb-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={`https://via.placeholder.com/50`}
                      alt="Reviewer"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-sm text-gray-500">~ {review.rated_by.firstname}</p> 
                      <p className="text-sm text-gray-600 mt-1">{review.review}</p>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 ml-0 sm:ml-4">
                    <div className="text-left sm:text-right">
                      <RatingStars rating={review.rate} />
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Review;