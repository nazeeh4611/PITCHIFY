import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import logo from "../Layout/Image/logo.jpeg";
import axios from "axios";
import { baseurl } from "../../Constent/regex";
import shortlogo from "../Layout/Image/shortlogo.png";

interface TextLoopProps {
  words: string[];
  interval?: number;
}

const TextLoop: React.FC<TextLoopProps> = ({ words = [], interval = 2000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true);
      }, 200);
    }, interval);

    return () => clearInterval(intervalId);
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
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getcategory();
  }, []);

  const handleToggleCategories = () => {
    if (visibleCategoriesCount === 8) {
      setVisibleCategoriesCount(category.length);
    } else {
      setVisibleCategoriesCount(8);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/investor/models?category=${categoryId}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setVisibleCategoriesCount(8);
  };

  const filteredCategories = category.filter((cat) =>
    cat.categoryname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar
        logoUrl={logo}
        shortLogoUrl={shortlogo}
        links={[
          { label: "Home", href: "/investor" },
          { label: "Explore Premium", href: "/explore-premium" },
          { label: "About Us", href: "/about-us" },
          { label: "Profile", href: "/investor/profile" },
        ]}
      />

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl my-24">
          <div className="bg-white rounded-[2%] shadow-lg p-4 sm:p-6 md:p-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">
                Invest in{" "}
                <TextLoop 
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
                {filteredCategories.slice(0, visibleCategoriesCount).map((category) => (
                  <div
                    key={category._id}
                    className="flex flex-col items-center bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer"
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <img
                      src={category.image}
                      alt={category.categoryname}
                      className="w-20 h-20 object-contain mb-4"
                    />
                    <p className="text-center text-gray-700 font-medium">
                      {category.categoryname}
                    </p>
                  </div>
                ))}
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

      <Footer />
    </div>
  );
};

export default InvestorHome;