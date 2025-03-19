import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import axios from 'axios';
import Adminnav from './Adminnav';
import { baseurl } from '../../Constent/regex';
import { BusinessModel } from '../../Interfacetypes/types';

const ModelDetails: React.FC = () => {
  const [model, setModel] = useState<BusinessModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getModelDetails = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin')}`,
        },
      });

      const response = await api.get(`/admin/model-details/${id}`);
      setModel(response.data);
    } catch (error) {
      console.error("Error fetching model details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getModelDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Adminnav toggleSidebar={toggleSidebar} />
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      </>
    );
  }

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
            className="w-full md:flex-1 bg-white rounded-lg shadow-lg p-4 md:p-6 overflow-y-auto"
            style={{
              height: "80vh"
            }}
          >
            {model && (
              <div className="space-y-6">
                <button
                  className="flex items-center text-gray-600 hover:text-gray-800 mb-2 transition-colors"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft className="mr-1" size={16} /> Back
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{model.uploadedentrepreneur?.firstname}</h2>
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">{model.businessName}</h1>
                  <p className="text-xl text-gray-600 italic">{model.tagline}</p>
                </div>

                <section className="space-y-3">
                  <h3 className="text-xl font-semibold border-b pb-2">Business Overview</h3>
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

                <section className="space-y-3">
                  <h3 className="text-xl font-semibold border-b pb-2">The Idea Behind It</h3>
                  <div className="space-y-3">
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

                <section className="space-y-3">
                  <h3 className="text-xl font-semibold border-b pb-2">Video Representation</h3>
                  <div className="relative bg-black aspect-video rounded-lg overflow-hidden">
                    <video
                      src={model.pitchvideo}
                      controls
                      controlsList="nodownload"
                      className="w-full h-full object-cover rounded-lg"
                    ></video>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-semibold border-b pb-2">Growth and Funding</h3>
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

                <section className="space-y-3">
                  <h3 className="text-xl font-semibold border-b pb-2">Why Invest?</h3>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModelDetails;