import Sidebar from './EntrepreneurSidebar';
import React, { useEffect, useState } from 'react';
import logo from "../Layout/Image/logo.jpeg";
import Navbar from '../Layout/Navbar';
import shortlogo from "../Layout/Image/shortlogo.png";
import { baseurl } from '../../Constent/regex';
import { useGetToken } from '../../token/Gettoken';
import axios from 'axios';

interface Review {
  _id: string;
  rate: number;
  review: string;
  rated_by: { firstname: string }; // assuming 'firstname' is within 'rated_by' object
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
  const [businessModels, setBusinessModels] = useState<BusinessModel[]>([]);  
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<BusinessModel | null>(null);
  const token = useGetToken("entrepreneur");
  const email = token?.email ?? '';

  const getmodel = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
      });

      const response = await api.post("/entrepreneur/models", { email });
      const models = response.data.businessModels;
      console.log(models,"the with model")
      // Save business models along with their reviews
      setBusinessModels(models);
    } catch (error) {
      console.error("Error in getmodel:", error);
    }
  };

  useEffect(() => {
    getmodel();
  }, []); 

  const openModal = (model: BusinessModel) => {
    setSelectedModel(model);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedModel(null);
  };

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
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
        <div
          className="bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-6 flex flex-col md:flex-row w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-[85%] xl:max-w-[1300px] relative z-10"
          style={{
            minHeight: "80vh",
            height: "auto",
            padding: "0.5rem",
          }}
        >
          <div className="md:w-1/4 w-full">
            <Sidebar onSectionChange={(id) => console.log(id)} />
          </div>

          <div className="md:w-3/4 w-full p-4">
            <div className="bg-white border border-gray-300 rounded-lg p-6 h-full">
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-left mb-6 mt-[-40px]">Rate & Reviews</h2>
                <div className="max-h-[450px] overflow-y-auto">
                  {businessModels.map((model) => (
                    model.reviews.length > 0 && (
                      <div key={model.businessName} className="mb-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white shadow-md p-4 rounded-lg mb-4">
                          <div className="flex items-start sm:items-center gap-4">
                            <img
                              src={`https://via.placeholder.com/50`}
                              alt={model.businessName}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <h3 className="font-semibold text-xl">{model.businessName}</h3>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row items-center sm:items-end gap-4">
                            <button
                              onClick={() => openModal(model)}
                              className="bg-indigo-900 text-white py-2 px-4 rounded-md"
                            >
                              Show Reviews
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedModel && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">{selectedModel.businessName} Reviews</h2>
            <div className="max-h-[300px] overflow-y-auto mb-4">
              {selectedModel.reviews.map((review) => (
                <div key={review._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white shadow-md p-4 rounded-lg mb-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={`https://via.placeholder.com/50`}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-sm text-gray-500">~ {review.rated_by.firstname}</p> 
                      <p className="text-sm text-gray-600">{review.review}</p>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row items-center sm:items-end gap-4">
                    <div className="text-center sm:text-left">
                      <RatingStars rating={review.rate} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="bg-red-700 text-white py-2 px-4 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Review;
