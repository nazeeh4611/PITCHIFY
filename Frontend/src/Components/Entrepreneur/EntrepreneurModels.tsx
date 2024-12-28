// src/components/ModelListing.tsx

import React from 'react';

interface SavedModel {
  postedDate: string;
  businessName: string;
  category: string;
  summary: string;
}

const ModelListing = () => {
    const savedModel = {
        postedDate: "12-12-2024",
        businessName: "Healthflex",
        category: "Health & Wellness",
        summary: "An AI-driven wearable device designed to revolutionize personal health monitoring, making it an accessible reality for all individuals."
      };
  return (
    <div className="rounded-lg shadow" style={{ background: "#F5F5F5", minHeight: "220px" }}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <p className="text-gray-500">posted date : {savedModel.postedDate}</p>
          <button className="px-6 py-1.5 bg-indigo-900 text-white rounded-md hover:bg-indigo-800">
            View
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <span className="text-gray-500">Business Name: </span>
              <span className="font-medium">{savedModel.businessName}</span>
            </div>
            <div>
              <span className="text-gray-500">Category : </span>
              <span className="font-medium">{savedModel.category}</span>
            </div>
          </div>
          <div className="border-t border-gray-300 mt-2"></div>

          <div>
            <div className="text-gray-500 mb-2">Summary</div>
            <p className="text-gray-700 leading-relaxed">{savedModel.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelListing;
