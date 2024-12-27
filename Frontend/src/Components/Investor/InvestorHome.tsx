import React from "react";
import Navbar from "../Layout/Navbar";
import Technology from "../Layout/Image/Technology.png";
import Health from "../Layout/Image/Health.png";
import Education from "../Layout/Image/Education.png";
import power from "../Layout/Image/Power-ev.png";
import Footer from "../Layout/Footer";

interface Category {
  id: number;
  title: string;
  image: string;
}

const categories: Category[] = [
  { id: 1, title: "Technology & Digital", image: Technology },
  { id: 2, title: "Health & Wellness", image: Health },
  { id: 3, title: "Education & Learning", image: Education },
  { id: 4, title: "Power & EV", image: power },
  { id: 5, title: "Money & Invest", image: "/images/money.png" },
  { id: 6, title: "Marketing", image: "/images/marketing.png" },
  { id: 7, title: "Fashion & Lifestyle", image: "/images/fashion.png" },
  { id: 8, title: "Farming & Agriculture", image: "/images/farming.png" },
];

const InvestorHome: React.FC = () => {
  return (
    <>
      <Navbar
        logoUrl={"../Layout/Image/logo.jpeg"}
        links={[
          { label: "Home", href: "/" },
          { label: "Explore Premium", href: "/explore-premium" },
          { label: "About Us", href: "/about-us" },
          { label: "Login", href: "/login" },
        ]}
      />

      {/* Adjusted container with margin for spacing */}
      <div className="mt-8">
        <div
          className="flex items-center justify-center bg-gray-100"
          style={{
            minHeight: "calc(100vh - 160px)", // to account for navbar and footer height
          }}
        >
          <div 
            className="bg-white rounded-[2%] shadow-lg p-4 sm:p-6 md:p-10 w-full max-w-7xl mx-4 sm:mx-6 lg:mx-8 xl:mx-auto"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">
                Invest in Innovation,
                <br />
                <span className="italic">"Shape the Future"</span>
              </h1>
              <div className="mt-8">
                <h2 className="text-xl font-medium">
                  "Find the Perfect Business Opportunity"
                </h2>
                <div className="mt-4 flex justify-center">
                  <input
                    type="text"
                    placeholder="Search business models..."
                    className="w-80 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="px-4 py-2 bg-purple-700 text-white rounded-r-lg hover:bg-purple-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col items-center bg-white p-4 rounded-lg shadow hover:shadow-lg"
                  >
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-20 h-20 object-contain mb-4"
                    />
                    <p className="text-center text-gray-700 font-medium">
                      {category.title}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="text-purple-700 hover:underline">Show more</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default InvestorHome;
