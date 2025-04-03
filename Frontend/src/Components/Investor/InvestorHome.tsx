import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import logo from "../Layout/Image/logo.jpeg";
import axios from "axios";
import { baseurl } from "../../Constent/regex";
import shortlogo from "../Layout/Image/shortlogo.png";
import { Investor } from "../../Interfacetypes/types";
import { useGetToken } from "../../token/Gettoken";
import { Lock } from "lucide-react";

interface TextCyclerProps {
  words: string[];
  interval?: number;
}

const TextCycler: React.FC<TextCyclerProps> = ({ words = [], interval = 2000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Don't set up anything if we have no words
    if (words.length === 0) return;

    const startCycle = () => {
      // Clear any existing intervals/timeouts
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(() => {
        // Start fade out
        setIsVisible(false);
        
        // Wait for fade out and then change word and fade in
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % words.length);
          setIsVisible(true);
        }, 200);
      }, interval);
    };

    startCycle();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [words.length, interval]);

  return (
    <span 
      className={`inline-block min-w-[200px] transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {words[currentIndex]}
    </span>
  );
};

interface Category {
  _id: string;
  categoryId: string;
  image: string;
  is_Listed: boolean;
  categoryname: string;
}

const InvestorHome = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState(8);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Partial<Investor>>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    premium: undefined
  }); 
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);

  const token = useGetToken("investor");
  const email = token?.email;

  const hasPremium = profile.premium?.endDate && new Date(profile.premium.endDate) > new Date();
  
  const getcategory = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
      });

      const response = await api.get(`/entrepreneur/category`);
      if (response.data.success) {
        let categories = response.data.data;

        const allCategoryIndex = categories.findIndex(
          (category) => category.categoryname === "All"
        );
        if (allCategoryIndex !== -1) {
          const allCategory = categories.splice(allCategoryIndex, 1)[0];
          categories = [allCategory, ...categories];
        }

        setCategory(categories);
        // Store the original order of category IDs
        setOriginalOrder(categories.map(cat => cat._id));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
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
    getcategory();
    accessData();
  }, [email]);

  const handleToggleCategories = () => {
    if (!hasPremium && visibleCategoriesCount === 8) {
      setShowPremiumModal(true);
      return;
    }
    setVisibleCategoriesCount(prev => prev === 8 ? category.length : 8);
  };

  const isCategoryLocked = (categoryId: string) => {
    if (hasPremium) return false;
    const originalIndex = originalOrder.indexOf(categoryId);
    return originalIndex >= 2;
  };

  const handleCategoryClick = (category: Category) => {
    if (isCategoryLocked(category._id)) {
      setShowPremiumModal(true);
      return;
    }
    navigate(`/investor/models?category=${category._id}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setVisibleCategoriesCount(8);
  };

  const filteredCategories = category.filter((cat) =>
    cat.categoryname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PremiumModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
        <h3 className="text-xl font-bold mb-4">Premium Feature</h3>
        <p className="mb-4">This feature is only available for premium members. Upgrade your plan to access all categories.</p>
        <div className="flex justify-end gap-4">
          <button 
            onClick={() => setShowPremiumModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <button 
            onClick={() => navigate('/pricing')}
            className="px-4 py-2 bg-indigo-900 text-white rounded hover:bg-indigo-800"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/investor" },
          { label: "Explore Premium", href: "/investor/plan-details" },
          { label: "About Us", href: "/about-us" },
          { label: "Profile", href: "/investor/profile" },
        ]}
        homeRoute="/investor"
      />

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl my-24">
          <div className="bg-white rounded-[2%] shadow-lg p-4 sm:p-6 md:p-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">
                Invest in{" "}
                <TextCycler 
                  words={["Innovation", "Technology", "Opportunities", "Creativity"]} 
                  interval={2000} 
                />
                ,<br />
                <span className="italic">"Shape the Future"</span>
              </h1>
              <div className="mt-8">
                <h2 className="text-xl font-medium">
                  "Find the Perfect Business Opportunity"
                </h2>
                <div className="mt-4 flex justify-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search business models..."
                    className="w-80 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-900"
                  />
                  <button className="px-4 py-2 bg-indigo-900 text-white rounded-r-lg hover:bg-indigo-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M18 11a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-700 mb-6">
                Filter by Category
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {filteredCategories.slice(0, visibleCategoriesCount).map((cat) => {
                  const isLocked = isCategoryLocked(cat._id);
                  
                  return (
                    <div
                      key={cat._id}
                      className={`relative flex flex-col items-center bg-white p-4 rounded-lg shadow hover:shadow-lg ${
                        isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                      }`}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      <img
                        src={cat.image}
                        alt={cat.categoryname}
                        className={`w-20 h-20 object-contain mb-4 ${isLocked ? 'opacity-50' : ''}`}
                      />
                      <p className={`text-center text-gray-700 font-medium ${isLocked ? 'text-opacity-50' : ''}`}>
                        {cat.categoryname}
                      </p>
                      {isLocked && (
                        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center rounded-lg">
                          <Lock className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {filteredCategories.length > 8 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleToggleCategories}
                    className="text-indigo-900 hover:underline"
                  >
                    {visibleCategoriesCount === 8 ? "Show more" : "Show less"}
                  </button>
                </div>
              )}
              {filteredCategories.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                  No categories found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPremiumModal && <PremiumModal />}
      <Footer />
    </div>
  );
};

export default InvestorHome;