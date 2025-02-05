  import React, { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import Navbar from "../Layout/Navbar";
  import logo from "../Layout/Image/logo.jpeg";
  import shortlogo from "../Layout/Image/shortlogo.png"

  import axios from "axios";
  import { baseurl } from "../../Constent/regex";

  interface BusinessModel {
    _id: string;
    businessName: string;
    tagline: string;
    fundinggoal: string;
    targetAudience: string;
    solution: string;
    problemStatement: string;
    useOfFunds: string;
    location:string;
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
  const ModelDetails = () => {
    const { id } = useParams();
    const [model, setModel] = useState<BusinessModel | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedModel, setEditedModel] = useState<BusinessModel | null>(null);
    const [category,setCategory] = useState("")

    useEffect(() => {
      const fetchModelDetails = async () => {
        try {
          const api = axios.create({
            baseURL:baseurl,
          });

          const response = await api.get(`/entrepreneur/model-details/${id}`);
          setModel(response.data);
          console.log(response,"be the response")
          setEditedModel(response.data);
        } catch (error) {
          console.error("Error fetching model details:", error);
        }
      };
      getcategory()

      if (id) {
        fetchModelDetails();
      }
    }, [id]);

    const getcategory = async () => {
      try {
          const api = axios.create({
              baseURL: "http://localhost:3009/api",
          });

          const response = await api.get(`/entrepreneur/category`);
          console.log(response.data.data); // Debugging
          if (response.data.success) {
            setCategory(response.data.data)
            console.log(category)
          }
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editedModel) return;

    const { name, value, type } = e.target;

    // Handle select input by updating categoryname in industryFocus
    if (type === 'select-one' && name === 'industryFocus') {
      setEditedModel({
        ...editedModel,
        industryFocus: {
          ...editedModel.industryFocus,
          categoryname: value, // Update categoryname in industryFocus
        },
      });
    } else {
      setEditedModel({ ...editedModel, [name]: value });
    }
  };



    const handleSaveChanges = async () => {
      try {
        const api = axios.create({
          baseURL: "http://localhost:3009/api",
        });

        await api.put(`/entrepreneur/model-details/${id}`, editedModel);
        setModel(editedModel);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating model details:", error);
      }
    };

    if (!model || !editedModel) {
      return <p>Loading model details...</p>;
    }

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
        <div className="min-h-screen bg-[#F5F5F5] p-4 md:p-8">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto p-6 relative">
            {/* Header Section */}
            <header className="mb-8">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="businessName"
                    value={editedModel.businessName}
                    onChange={handleInputChange}
                    className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 w-full border rounded p-2"
                  />
                  <textarea
                    name="tagline"
                    value={editedModel.tagline}
                    onChange={handleInputChange}
                    className="text-xl md:text-2xl text-gray-600 w-full border rounded p-2"
                  />
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                    {model.businessName}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600">
                    "{model.tagline}"
                  </p>
                </>
              )}
            </header>

            {/* Business Overview Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold border-b-2 border-gray-300 mb-4">
                Business Overview
              </h2>
              <div className="space-y-2">
                {isEditing ? (
                  <>
                     <input
                      type="text"
                      name="location"
                      value={editedModel.location}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
              <select
                name="industryFocus"
                value={editedModel?.industryFocus.categoryname || ""} // Correctly bind the selected category
                onChange={handleInputChange}
                className="w-full p-2 border"
              >
                <option value="">Select</option>
                {category && Array.isArray(category) && category.map((cat: { categoryname: string; image: string; is_Listed: boolean }) => (
                  <option key={cat.categoryname} value={cat.categoryname}>
                    {cat.categoryname}
                  </option>
                ))}
              </select>



                    <input
                      type="text"
                      name="targetAudience"
                      value={editedModel.targetAudience}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  </>
                ) : (
                  <>
                  <p>
                      <span className="font-semibold">📍Location:</span>{" "}
                      {model.location}
                    </p>
                    <p>
                      <span className="font-semibold">Industry Focus:</span>{" "}
                      {model.industryFocus.categoryname}
                    </p>
                    <p>
                      <span className="font-semibold">Target Audience:</span>{" "}
                      {model.targetAudience}
                    </p>
                  </>
                )}
              </div>
            </section>

            {/* The Idea Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold border-b-2 border-gray-300 mb-4">
                The Idea Behind It
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">The Problem:</h3>
                  {isEditing ? (
                    <textarea
                      name="problemStatement"
                      value={editedModel.problemStatement}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  ) : (
                    <p className="text-gray-700">{model.problemStatement}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">The Solution:</h3>
                  {isEditing ? (
                    <textarea
                      name="solution"
                      value={editedModel.solution}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  ) : (
                    <p className="text-gray-700">{model.solution}</p>
                  )}
                </div>
              </div>
            </section>


  {/* Video Section */}
  <section className="mb-8">
    <h2 className="text-2xl font-bold border-b-2 border-gray-300 mb-4">
      Video Representation
    </h2>
    <div className="relative bg-black/5 rounded-lg aspect-video mb-4">
      {/* Show the video preview or existing video */}
      {editedModel?.pitchvideo && (
        <video
          key={editedModel.pitchvideo} // Key prop to force re-render when source changes
          className="w-full h-full object-cover rounded-lg"
          controls
          src={editedModel.pitchvideo}
        >
          Your browser does not support the video tag.
        </video>
      )}

      {/* Show placeholder if no video is present */}
      {!editedModel?.pitchvideo && !isEditing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No video available</p>
        </div>
      )}
    </div>

    {/* Upload Button */}
    {isEditing && (
      <div className="flex items-center justify-center">
        <label
          htmlFor="videoUpload"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-lg font-bold cursor-pointer flex items-center gap-2"
        >
          <span>+</span>
          <span className="text-sm">Upload Video</span>
        </label>
        <input
          id="videoUpload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const fileUrl = URL.createObjectURL(file);
              setEditedModel((prev) => 
                prev ? { ...prev, pitchvideo: fileUrl } : null
              );
            }
          }}
        />
      </div>
    )}
  </section>




            {/* Growth and Funding Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold border-b-2 border-gray-300 mb-4">
                Growth and Funding
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Funding Goal:</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fundinggoal"
                      value={editedModel.fundinggoal}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  ) : (
                    <p className="text-gray-700">
                      ${model.fundinggoal.toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">Use of Funds:</h3>
                  {isEditing ? (
                    <textarea
                      name="useOfFunds"
                      value={editedModel.useOfFunds}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  ) : (
                    <p className="text-gray-700">{model.useOfFunds}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Why Invest Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold border-b-2 border-gray-300 mb-4">
                Why Invest?
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Market Opportunity:</h3>
                  {isEditing ? (
                    <textarea
                      name="marketOpportunities"
                      value={editedModel.marketOpportunities}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  ) : (
                    <p className="text-gray-700">{model.marketOpportunities}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">Team Expertise:</h3>
                  {isEditing ? (
                    <textarea
                      name="teamexpertise"
                      value={editedModel.teamexpertise}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  ) : (
                    <p className="text-gray-700">{model.teamexpertise}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="flex items-center justify-between mt-8">
    {isEditing ? (
      <>
        <button
          onClick={handleSaveChanges}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
        <button
          onClick={() => {
            setEditedModel(model); // Reset to original model
            setIsEditing(false); // Exit editing mode
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </>
    ) : (
      <button
        onClick={() => setIsEditing(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Edit
      </button>
    )}
  </footer>

          </div>
        </div>
      </>
    );
  };

  export default ModelDetails;
