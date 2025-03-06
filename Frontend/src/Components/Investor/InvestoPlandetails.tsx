import React from 'react';

interface SubscriptionDetailsProps {
  investorData: any;
  startDate: string;
  endDate: string;  
}

const InvestorSubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({ investorData, startDate, endDate }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Calculate days remaining until end date
  const calculateDaysRemaining = () => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300">
      {/* Subscription Status */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
          <h2 className="text-lg font-bold text-gray-800">Investor Plan</h2>
        </div>
        <span className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">Active</span>
      </div>

      {/* Styled Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3"></div>

      {/* Key Subscription Information with compact styling */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">Renewal Date</span>
          <span className="text-sm font-semibold text-gray-800">{formatDate(endDate)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">Status</span>
          <span className="text-sm font-semibold text-blue-600">{daysRemaining} days remaining</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">Amount</span>
          <span className="text-sm font-semibold text-gray-800">${investorData?.price || "29.00"}/month</span>
        </div>
      </div>

      {/* Features with compact styling */}
      <div className="mb-3 bg-gray-50 p-3 rounded-lg">
        <h3 className="text-xs font-bold text-gray-700 mb-2 flex items-center">
          <svg className="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          Plan Includes:
        </h3>
        <ul className="text-xs space-y-1 text-gray-600">
          <li className="flex items-center">
            <div className="w-4 h-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-2">
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span>Premium model filtering</span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-2">
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span>Direct entrepreneur communication</span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-2">
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span>Advanced analytics dashboard</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons with compact styling */}
      <div className="space-y-2">
        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-1.5 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-xs shadow-sm flex justify-center items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
          </svg>
          Manage Subscription
        </button>
        <button className="w-full text-gray-500 text-xs hover:text-red-600 transition-colors duration-200 flex justify-center items-center py-1">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          Cancel Subscription
        </button>
      </div>
    </div>
  );
};

export default InvestorSubscriptionDetails;