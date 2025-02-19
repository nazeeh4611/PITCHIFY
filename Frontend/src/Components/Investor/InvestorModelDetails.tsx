import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { baseurl } from '../../Constent/regex';
import { useGetToken } from '../../token/Gettoken';
import shortlogo from "../Layout/Image/shortlogo.png"
import logo from "../Layout/Image/logo.jpeg";
import Navbar from "../Layout/Navbar";


interface BusinessModel {
  _id: string;
  businessName: string;
  tagline: string;
  fundinggoal: string;
  targetAudience: string;
  solution: string;
  problemStatement: string;
  useOfFunds: string;
  marketOpportunities: string;
  teamexpertise: string;
  pitchvideo: string;
  industryFocus: {
    categoryname: string;
    image: string;
    is_Listed: boolean;
  };
  createdAt: string;
}

interface User {
  profile: string;
  firstname: string;
  _id:string
}



const ModelDetailsInvestor: React.FC = () => {
  const [model, setModel] = useState<BusinessModel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useGetToken("investor");

  const email = token?.email;

  const getModelDetails = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
      });

      const response = await api.get(`/investor/model-details/${id}`);
      console.log(response.data,"here be the data ")
      setModel(response.data);
      setUser(response.data.uploadedentrepreneur)
    } catch (error) {
      console.error("Error fetching model details:", error);
      toast.error("Failed to fetch model details. Please try again.");
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
      });
  
      await api.post('/investor/submit-rating', {
        modelId: id,
        rating,
        review,
        email,
      });
  
      toast.success("Rating submitted successfully!");
  
      setRating(0);
      setReview('');
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    }
  };
  


  const handleConnectNow = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
      });
  
      const response = await api.post('/investor/create-chat', {
        entrepreneurId: user?._id,  
        investorEmail: email,
        modelId: id
      });
  
  
      // Add a check to ensure chatId exists
      if (response.data.chatId) {
        navigate(`/investor/chat`);
      } else {
        toast.error("Failed to create chat. Please try again.");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to start chat. Please try again.");
    }
  };



  useEffect(() => {
    getModelDetails();
  }, []);

  if (!model) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
       <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/investor" },
          { label: "Profile", href: "/investor/profile" },
        ]}
      />
      <div className="max-w-4xl mx-auto">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Back
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
            <img
              src={ user?.profile|| "/placeholder.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.firstname}</h2>
            <p className="text-gray-600"></p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">{model.businessName}</h1>
            <p className="text-xl text-gray-600 italic">{model.tagline}</p>
          </div>

          <section className="space-y-4">
            <h3 className="text-2xl font-semibold border-b pb-2">Business Overview</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Category:</span> {model.industryFocus.categoryname}
                </p>
                <p>
                  <span className="font-semibold">Target Audience:</span> {model.targetAudience}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-semibold border-b pb-2">The Idea Behind It</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">The Problem:</p>
                <p className="text-gray-700">{model.problemStatement}</p>
              </div>
              <div>
                <p className="font-semibold">The Solution:</p>
                <p className="text-gray-700">{model.solution}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-semibold border-b pb-2">Video Representation</h3>
            <div className="relative bg-black aspect-video rounded-lg overflow-hidden">
              <video
                src={model.pitchvideo}
                controls
                controlsList="nodownload"
                className="w-full h-full object-cover rounded-lg"
              ></video>
            </div>
          </section>


          <section className="space-y-4">
            <h3 className="text-2xl font-semibold border-b pb-2">Growth and Funding</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Funding Goal:</span> {model.fundinggoal}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Use of Funds:</span> {model.useOfFunds}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-semibold border-b pb-2">Why Invest?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Market Opportunity:</span> {model.marketOpportunities}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Team Expertise:</span> {model.teamexpertise}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-semibold border-b pb-2">Call to Action</h3>
            <div className="flex flex-wrap gap-4">
            <button 
  className="px-6 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800 transition-colors"
  onClick={handleConnectNow}
>
  Connect Now
</button>
              <button 
                className="px-6 py-2 border-2 border-indigo-900 text-indigo-900 rounded-md hover:bg-indigo-50 transition-colors"
                onClick={() => setShowModal(true)}
              >
                Rate Now
              </button>
            </div>
          </section>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full m-4">
            <h3 className="text-xl font-semibold mb-4">Rate and Review</h3>
            <div className="mb-4">
              <p className="mb-2 font-semibold">Rating:</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      rating >= star ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className="mb-2 font-semibold">Review:</p>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2"
                rows={4}
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-800"
                onClick={handleRatingSubmit}
                disabled={!rating || !review}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelDetailsInvestor;