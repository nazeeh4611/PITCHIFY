// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import { useGetToken } from "../../token/Gettoken";
// import Sidebar from "./InvestorSidebar"; 
// import axios from "axios";
// import logo from "../Layout/Image/logo.jpeg";
// import Navbar from "../Layout/Navbar";

// const InvestorDetails = () => {
//   const location = useLocation();
//   const userType = location.pathname.includes("investor") ? "investor" : "entrepreneur";

//   const token = useGetToken("investor");
//   const email = token?.email;

//   const [profile, setProfile] = useState({
//     firstname: "",
//     lastname: "",
//     email: "",
//     phone: "",
//     avatar: "/api/placeholder/48/48",
//   });

//   const [showNotificationModal, setShowNotificationModal] = useState(true);
//   const [showVerificationForm, setShowVerificationForm] = useState(false);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
//       console.log("File uploaded:", file);
//     } else {
//       alert("Please upload an image or PDF file.");
//     }
//   };

//   return (
//     <>
//       <Navbar
//         logoUrl={logo}
//         links={[
//           { label: "Home", href: "/" },
//           { label: "About Us", href: "/about-us" },
//         ]}
//       />

//       {/* Notification Modal */}
//       {showNotificationModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg p-8 max-w-lg w-full">
//             <h2 className="text-xl font-bold">Verification Needed</h2>
//             <p className="mt-4">To access models, you need to verify your company or Investor Profile.</p>
//             <button
//               className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={() => {
//                 setShowNotificationModal(false);
//                 setShowVerificationForm(true);
//               }}
//             >
//               Verify Now
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Verification Form Modal */}
//       {showVerificationForm && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg p-8 max-w-lg w-full">
//             <h2 className="text-xl font-bold">Verification Form</h2>
//             <p className="mt-4">Please upload your verification documents (image or PDF).</p>
//             <input
//               type="file"
//               accept="image/*,application/pdf"
//               className="mt-4 border p-2 rounded w-full"
//               onChange={handleFileUpload}
//             />
//             <button
//               className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={() => {
//                 setShowVerificationForm(false);
//               }}
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Container */}
//       <div className="flex justify-center bg-gray-200 min-h-screen py-8">
//         <div className="bg-white shadow-lg rounded-lg w-4/5 flex">
//           {/* Sidebar Section */}
//           <div className="w-1/4 bg-gray-100 rounded-l-lg p-6">
//             <Sidebar onSectionChange={(id) => console.log(id)} />
//           </div>

//           {/* Details Content Section */}
//           <div className="w-3/4 p-8">
//             <h1 className="text-2xl font-bold mb-4">Investor Details</h1>
//             <div className="bg-gray-50 rounded-lg shadow-inner p-6">
//               <p className="text-gray-600">Here, you can view and manage your investor details.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default InvestorDetails;
