import React from "react";
import Hero1 from "../Layout/Image/Hero1.jpeg";
import Hero2 from "../Layout/Image/Hero2.png";
import Hero3 from "../Layout/Image/Hero3.png";
import ChatbotIcon from "../Common/Chaticon";
import Typewriter from "typewriter-effect";


const Hero: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-10 px-4 mt-16 flex-row">
        <div className="w-full md:w-1/2 mb-6 md:mb-0 flex justify-start">
        <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-left pl-6 mb-6 mt-5 sm:mt-[-50px]">
      Empowering <br />
      <span className="pr-4" style={{ color: "#939393" }}>
        <Typewriter
          options={{
            strings: ["Ideas", "Innovations", "Dreams", "Visions"], // Add more words as needed
            autoStart: true,
            loop: true,
          }}
        />
      </span>
    </h1>
        </div>
        <div className="w-full md:w-1/2 flex justify-end">
          <img
            src={Hero1}
            alt="Hero"
            className="rounded-full w-40 h-40 sm:w-56 sm:h-56 md:w-96 md:h-96 lg:w-[700px] lg:h-[700px] object-cover"
          />
        </div>
      </div>
      <div className="md:mb-0">
        <h3 className="text-sm sm:text-xl md:text-3xl lg:text-5xl xl:text-4xl font-bold text-center mt-10 mb-0 leading-none">
          Trusted by visionary entrepreneurs and forward-thinking investors
        </h3>
      </div>

      <div className="flex items-center justify-between py-0 px-4 flex-row-reverse mb-6">
        <div className="w-full md:w-1/2 mb-6 md:mb-0 flex justify-start">
          <div className="">
            <div className="w-full">
              <h2 className="text-[10px] sm:text-4xl font-semibold text-gray-800 mb-2">
                Present Your Vision, Attract Investment
              </h2>
              <h6 className="text-[7px] sm:text-lg font-semibold text-gray-800 mb-2">
                Showcase your business model to a community of investors eager
                to fund the next big idea.
              </h6>
              <div className="flex flex-col items-center">
                <p className="text-[6px] sm:text-sm text-gray-700 mt-2">
                  Utilize our platform to share your business model and bring
                  your entrepreneurial vision to fruition. Whether you are a
                  startup founder, small business owner, or innovator, we
                  provide the platform to present your concept to motivated
                  investors. Emphasize your goals and connect with those who
                  share your vision. Together, we can transform your idea into
                  reality.
                </p>
                <button className="mt-4 px-1 py-0.5 text-[6px] sm:px-4 sm:py-2 sm:text-sm border-2 border-[#00186E] text-[#00186E] font-medium rounded hover:bg-[#00186E] hover:text-white transition-all duration-300">
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-start">
          <img
            src={Hero2}
            alt="Image Left"
            className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[750px] lg:h-[750px] object-cover"
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-0 px-4 flex-row mb-6">
        <div className="w-full md:w-1/2 mb-6 md:mb-0 flex justify-end pl-4">
          {" "}
          <div className="">
            <div className="w-full">
              <h2 className="text-[10px] sm:text-4xl font-semibold text-gray-800 mb-2">
                Invest in Vision, Fuel Innovation
              </h2>
              <h6 className="text-[7px] sm:text-lg font-semibold text-gray-800 mb-2">
                Discover groundbreaking business ideas and invest in the future
                of innovation
              </h6>
              <div className="flex flex-col items-center">
                <p className="text-[6px] sm:text-sm text-gray-700 mt-2">
                  Utilize our platform to share your business model and bring
                  your entrepreneurial vision to fruition. Whether you are a
                  startup founder, small business owner, or innovator, we
                  provide the platform to present your concept to motivated
                  investors. Emphasize your goals and connect with those who
                  share your vision. Together, we can transform your idea into
                  reality.
                </p>
                <button className="mt-4 px-1 py-0.5 text-[6px] sm:px-4 sm:py-2 sm:text-sm border-2 border-[#00186E] text-[#00186E] font-medium rounded hover:bg-[#00186E] hover:text-white transition-all duration-300">
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-start">
          <img
            src={Hero3}
            alt="Image Right"
            className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[750px] lg:h-[750px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

