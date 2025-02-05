import React, { useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UseDispatch, useDispatch } from 'react-redux';
import { AdminAuth } from '../../Redux/AdminTokenSlice';
import { baseurl } from '../../Constent/regex';


const AdminLogin: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate =useNavigate();
  const dispatch = useDispatch()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      if (!email || !password) {
        console.error('Email or Password is missing');
        return;
      }

      const response = await axios.post(
        `http://localhost:3009/api/admin/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data.token);

      if(response){
        dispatch(
          AdminAuth({
            token: response.data.token,
          })
        );
      navigate("/admin/investorlist")
      }

    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error state or show an error message to the user
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          ADMIN LOGIN
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-900 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              SIGN IN
            </button>
          </div>
        </form>
      </div>
    </div>
   </>
  );
};

export default AdminLogin;

