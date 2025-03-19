import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';
import Adminnav from './Adminnav';
import { baseurl } from '../../Constent/regex';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Entrepreneur {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  profile: string;
  is_Blocked: boolean;
}

const EntrepreneurList: React.FC = () => {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<Entrepreneur | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getEntrepreneur = async () => {
    try {
      const api = axios.create({
        baseURL: baseurl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin')}`,
        },
      });

      const response = await api.get('/admin/entrepreneurlist');
      console.log(response);
      const fetchedEntrepreneurs = Array.isArray(response.data) ? response.data : [response.data];
      setEntrepreneurs(fetchedEntrepreneurs);
    } catch (error) {
      console.error('Error fetching entrepreneurs:', error);
    }
  };

  useEffect(() => {
    getEntrepreneur();
  }, []);

  const handleBlock = async (email: string, isBlocked: boolean) => {
    try {
      const api = axios.create({
        baseURL: baseurl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin')}`,
        },
      });

      const response = await api.post('/admin/entrepreneurblock', { email });
      console.log(response);

      setEntrepreneurs((prevEntrepreneurs) =>
        prevEntrepreneurs.map((entrepreneur) =>
          entrepreneur.email === email
            ? { ...entrepreneur, is_Blocked: !isBlocked }
            : entrepreneur
        )
      );
      toast.success(`Entrepreneur ${isBlocked ? 'unblocked' : 'blocked'} successfully!`);
    } catch (error) {
      console.error('Error blocking entrepreneur:', error);
      toast.error('Failed to update block status. Try again!');
    }
  };

  const confirmBlock = (entrepreneur: Entrepreneur) => {
    setSelectedEntrepreneur(entrepreneur);
  };

  const handleConfirm = () => {
    if (selectedEntrepreneur) {
      handleBlock(selectedEntrepreneur.email, selectedEntrepreneur.is_Blocked);
      setSelectedEntrepreneur(null);
    }
  };

  const handleCancel = () => {
    setSelectedEntrepreneur(null);
  };

  return (
    <>
      <Adminnav toggleSidebar={toggleSidebar} />

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}>
      </div>
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-100 z-50 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="pt-16 px-4 h-full">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 p-4 pt-20">
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row w-full max-w-6xl">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-1/4 md:mr-6">
            <Sidebar />
          </div>

          <div
            className="w-full md:flex-1 bg-white rounded-lg shadow-lg p-4 md:p-6 space-y-4"
            style={{
              minHeight: "80vh",
              height: "auto",
              overflowY: "auto",
            }}
          >
            <div className="bg-indigo-950 text-white rounded-lg px-6 py-3 flex justify-center items-center">
              <span className="text-lg font-semibold">Entrepreneur List</span>
            </div>

            <div className="space-y-4">
              {entrepreneurs.map((entrepreneur) => (
                <div
                  key={entrepreneur._id}
                  className="p-2 flex flex-col sm:flex-row items-start sm:items-center shadow-md border rounded-lg"
                  style={{
                    minHeight: "4rem",
                  }}
                >
                  <div className="flex items-center space-x-3 w-full sm:w-1/3 mb-2 sm:mb-0">
                    <img
                      src={entrepreneur.profile}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-medium text-sm">
                        {entrepreneur.firstname} {entrepreneur.lastname}
                      </h3>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/3 sm:text-center mb-2 sm:mb-0">
                    <p className="text-gray-600 text-sm">{entrepreneur.email}</p>
                  </div>

                  <div className="w-full sm:w-1/3 flex justify-start sm:justify-end">
                    <button
                      className={`px-4 py-1 rounded-lg text-white text-sm font-medium ${
                        entrepreneur.is_Blocked
                          ? 'bg-[#B85C38] hover:bg-[#A34D2F]'
                          : 'bg-[#75B85C] hover:bg-[#64A34D]'
                      }`}
                      onClick={() => confirmBlock(entrepreneur)}
                    >
                      {entrepreneur.is_Blocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      className='px-4 py-1 rounded-lg text-white text-sm font-medium bg-blue-900'
                   onClick={()=>navigate(`/admin/entrepreneurlist/${entrepreneur._id}`)} >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedEntrepreneur && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg m-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Are you sure you want to {selectedEntrepreneur.is_Blocked ? 'unblock' : 'block'}{' '}
              {selectedEntrepreneur.firstname}?
            </h2>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                onClick={handleCancel}
              >
                No
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-white ${
                  selectedEntrepreneur.is_Blocked ? 'bg-green-500' : 'bg-red-500'
                }`}
                onClick={handleConfirm}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EntrepreneurList;