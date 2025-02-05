import React from 'react';

interface SubscriptionDetailsProps {
  entrepreneurdata: any;
  startDate: string;
  endDate: string;  
}

const EntrepreneurSubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({ entrepreneurdata, startDate, endDate }) => {
  console.log(entrepreneurdata, startDate, endDate, "the datas");

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

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Plan Details</h2>
        <div className="border rounded-lg p-4">
          <h3 className="text-blue-600 text-md font-bold">{entrepreneurdata?.name || "Monthly Plan"}</h3>
          <p className="text-sm text-gray-600">{entrepreneurdata?.description || "30 Days Plan"}</p>
          <p className="text-sm text-gray-600">Unlimited model listing</p>
          <p className="text-sm text-gray-600">Directly connect investors</p>
          <button className="mt-4 text-blue-600 font-semibold hover:underline">Change Plan</button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Payment Details</h2>
        <div className="border rounded-lg p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Next Payment</p>
            <p className="text-md font-semibold text-gray-800">{formatDate(endDate)}</p>
          </div>
          <button className="w-full text-left text-blue-600 font-semibold hover:underline">
            Manage Payment Method
          </button>
          <button className="w-full text-left text-blue-600 font-semibold hover:underline">
            View Payment History
          </button>
        </div>
      </div>

      <button
        className="w-full bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-200"
      >
        Cancel Subscription
      </button>
    </div>
  );
};

export default EntrepreneurSubscriptionDetails;
