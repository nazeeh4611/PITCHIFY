import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import Adminnav from './Adminnav';
import { baseurl } from '../../Constent/regex';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EntrepreneurList: React.FC = () => {
  const [Entrepreneur, setEntrepreneur] = useState<any[]>([]);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<any | null>(null);

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
      setEntrepreneur(fetchedEntrepreneurs);
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

      setEntrepreneur((prevEntrepreneurs) =>
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

  const confirmBlock = (entrepreneur: any) => {
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
      <Adminnav />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 flex w-full max-w-6xl space-x-6">
          <Sidebar />

          <div
            className="flex-1 bg-white rounded-lg shadow-lg p-6 space-y-4"
            style={{
              height: '80vh',
              overflowY: 'auto',
            }}
          >
            <div className="bg-indigo-950 text-white rounded-lg px-6 py-3 flex justify-center items-center">
              <span className="text-lg font-semibold">Entrepreneur List</span>
            </div>

            <div className="space-y-4">
              {Entrepreneur.map((entrepreneur) => (
                <div
                  key={entrepreneur._id}
                  className="p-2 flex items-center shadow-md border rounded-lg"
                  style={{
                    height: '5rem',
                  }}
                >
                  <img
                    src={entrepreneur.profile}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover border mr-4"
                  />
                  <div className="flex items-center space-x-3 w-1/3">
                    <div>
                      <h3 className="font-medium text-sm">
                        {entrepreneur.firstname} {entrepreneur.lastname}
                      </h3>
                    </div>
                  </div>

                  <div className="text-center w-1/3">
                    <p className="text-gray-600 text-sm">{entrepreneur.email}</p>
                  </div>

                  <div className="w-1/3 flex justify-end">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedEntrepreneur && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
