import React, { useState ,useEffect} from 'react';
import Navbar from '../Layout/Navbar';
import logo from "../Layout/Image/logo.jpeg";
import axios from 'axios';
import { useGetToken } from '../../token/Gettoken';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseurl } from '../../Constent/regex';
import shortlogo from "../Layout/Image/shortlogo.png"



const Alert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative">
    {children}
  </div>
);

type FormData = {
  businessName: string;
  tagline: string;
  industryFocus: string;
  targetAudience: string;
  fundingGoal: string;
  problemStatement: string;
  solution: string;
  useOfFunds: string;
  location:string;
  marketOpportunities: string;
  teamExpertise?: string;
  pitchVideo?: File;
  email:string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

const Addmodel: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    tagline: '',
    industryFocus: '',
    targetAudience: '',
    fundingGoal: '',
    problemStatement: '',
    solution: '',
    useOfFunds: '',
    location:'',
    marketOpportunities: '',
    teamExpertise: '',
    email:""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [category,setCategory] = useState("")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.tagline.trim()) {
      newErrors.tagline = 'Tagline is required';
    }
    
    
    if (!formData.fundingGoal.trim()) {
      newErrors.fundingGoal = 'Funding goal is required';
    } else if (isNaN(Number(formData.fundingGoal))) {
      newErrors.fundingGoal = 'Please enter a valid number';
    }
    
    if (!formData.problemStatement.trim()) {
      newErrors.problemStatement = 'Problem statement is required';
    }
    
    if (!formData.solution.trim()) {
      newErrors.solution = 'Solution is required';
    }

    if(!formData.location.trim()) {
      newErrors.solution = 'location is required'
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const getcategory = async () => {
    try {
        const api = axios.create({
            baseURL: baseurl,
        });

        const response = await api.get(`/entrepreneur/category`);
        console.log(response.data.data); 
        if (response.data.success) {
          setCategory(response.data.data)
          console.log(category)
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};
useEffect(() => {
  getcategory();
}, [])


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, pitchVideo: e.target.files[0] });
    }
  };

  const token = useGetToken("entrepreneur");
  const email = token?.email ?? ''; 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

  console.log("first")
    if (validateForm()) {
      const formDataToSend = new FormData();
  
      Object.keys(formData).forEach(key => {
        if (key !== 'pitchVideo' && formData[key]) { 
          formDataToSend.append(key, formData[key]);
        }
      });
  
      if (formData.pitchVideo) {
        formDataToSend.append('file', formData.pitchVideo);
      }

      formDataToSend.append("email",email)
      console.log(formData,"the form data is ber")
  
      try {
        const api = axios.create({
          baseURL: baseurl,
        });
  
        const response = await api.post(`/entrepreneur/add-model`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
       
        if (response.status === 200) {
          toast.success("Business model submitted successfully!");
          setTimeout(() => {
            window.location.href = "/entrepreneur/models";
          }, 3000); 
        }
      } catch (error) {
        console.error('Error uploading the model:', error);
        if (error.response) {
          setSubmitError(error.response.data.message || 'Error uploading the model');
        } else {
          setSubmitError('Error uploading the model');
        }
      }
    } else {
      setSubmitError('Please fix the errors before submitting');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/entrepreneur" },
          { label: "About Us", href: "/about-us" },
        ]}
        homeRoute="/entrepreneur"
      />
      
      <div className="max-w-4xl mx-auto p-8 mt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Share Your Vision</h1>
          <p className="text-gray-600">Submit your business model and connect with entrepreneurs ready to innovate and collaborate.</p>
        </div>

        {submitError && (
          <Alert>
            <p>{submitError}</p>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>
          </div>

          <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.tagline ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.tagline && <p className="text-red-500 text-sm">{errors.tagline}</p>}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Industry Focus</label>
              <select
                name="industryFocus"
                value={formData.industryFocus}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.industryFocus ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Select</option>
                {category && Array.isArray(category) && category.map((cat: { _id: string; categoryname: string }) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryname}
                  </option>
                ))}
              </select>


              {errors.industryFocus && <p className="text-red-500 text-sm">{errors.industryFocus}</p>}
            </div>  

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Funding Goal</label>
              <input
                type="text"
                name="fundingGoal"
                value={formData.fundingGoal}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.fundingGoal ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.fundingGoal && <p className="text-red-500 text-sm">{errors.fundingGoal}</p>}
            </div>
          </div>
         

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Problem Statement</label>
            <textarea
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              rows={3}
              className={`w-full p-2 border ${errors.problemStatement ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.problemStatement && <p className="text-red-500 text-sm">{errors.problemStatement}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Solution</label>
            <textarea
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              rows={3}
              className={`w-full p-2 border ${errors.solution ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.solution && <p className="text-red-500 text-sm">{errors.solution}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Team Expertise (optional)</label>
            <textarea
              name="teamExpertise"
              value={formData.teamExpertise}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
         
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Target Audience </label>
            <textarea
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Use of Funds </label>
            <textarea
              name="useOfFunds"
              value={formData.useOfFunds}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Market Opportunities</label>
            <textarea
              name="marketOpportunities"
              value={formData.marketOpportunities}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pitch Video (optional)</label>
         <input
          type="file"
          name="file" 
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          accept="video/*"
        />


          </div>

          <button
            type="submit"
            className="w-full bg-[#00186E] text-white p-3 rounded-md hover:bg-[#001255] transition-colors duration-200 font-semibold"
          >
            Submit Business Model
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addmodel;