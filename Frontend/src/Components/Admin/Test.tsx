import React from 'react';

interface Category {
  id: string;
  icon: React.ReactNode;
  name: string;
  modelCount: number;
  isBlocked: boolean;
}

const CategoryIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-indigo-950 rounded-full p-3 w-12 h-12 flex items-center justify-center text-white">
    {children}
  </div>
);

const DashboardPage = () => {
  const categories: Category[] = [
    {
      id: '1',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        </svg>
      ),
      name: 'Education & Learning',
      modelCount: 20,
      isBlocked: false
    },
    {
      id: '2',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      name: 'Travel & Tourism',
      modelCount: 20,
      isBlocked: true
    },
    {
      id: '3',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      name: 'Finance & Money',
      modelCount: 20,
      isBlocked: false
    },
    {
      id: '4',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      name: 'Health & Wellness',
      modelCount: 20,
      isBlocked: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-20 bg-indigo-950 md:min-h-screen p-4">
          <nav className="flex md:flex-col justify-around md:justify-start md:space-y-8">
            <div className="p-2 text-white hover:bg-indigo-900 rounded-lg cursor-pointer">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-2 text-white hover:bg-indigo-900 rounded-lg cursor-pointer">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="p-2 text-white hover:bg-indigo-900 rounded-lg cursor-pointer">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center bg-indigo-950 text-white rounded-lg px-6 py-3">
              <span>Revenue</span>
              <span>Models</span>
              <span className="bg-white text-indigo-950 px-4 py-1 rounded-full">Category</span>
            </div>
          </div>

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <CategoryIcon>{category.icon}</CategoryIcon>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Model Count : {category.modelCount}</span>
                  <button
                    className={`px-4 py-2 rounded-lg text-white ${
                      category.isBlocked ? 'bg-red-600' : 'bg-green-500'
                    }`}
                  >
                    {category.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;