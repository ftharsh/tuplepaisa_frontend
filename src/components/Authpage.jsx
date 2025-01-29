import React, { useState } from 'react';
import axios from 'axios';
import {setToken} from './utils/authService.js'
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveUserData = (username, email) => {
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const API_URL = 'http://localhost:8080/api/user';

    try {
      if (!isRightPanelActive) {
        const response = await axios.post(`${API_URL}/login`, {
          username: formData.username,
          password: formData.password,
        });
        if (response.data.token) {
          setToken(response.data.token);
          //! it will save usrname and get email from response if avble
          saveUserData(formData.username, response.data.email || '');
          console.log(formData.username);
          setMessage('Login successful!');
          navigate('/dashboard');
        }
      } else {
        const response = await axios.post(`${API_URL}/register`, formData);
        // !! it will save usr data upon successful reg*
        saveUserData(formData.username, formData.email);
        setMessage('Registration successful! Please login.');
        setIsRightPanelActive(false);
      }
    } catch (error) {
      setMessage(error.response?.data || 'An error occurred');
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 ">
      <div className="relative overflow-hidden bg-white rounded-lg shadow-2xl w-[768px] min-h-[480px]">
        
        {/* Register Form starts here */}
        <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out ${
            isRightPanelActive 
              ? 'w-1/2 translate-x-0 opacity-100' 
              : 'w-1/2 translate-x-full opacity-0'
          }`}
        >
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-full bg-white px-12 text-center">
            <h1 className="font-bold text-2xl mb-2">Create Account</h1>
            <p className="text-gray-600 mb-8">Join our community and start your journey!</p>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="bg-gray-100 border-none p-3 mb-2 w-full rounded-lg transition-all duration-300 hover:bg-gray-200 focus:ring-2 focus:ring-[#2B7DFF]"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-100 border-none p-3 mb-2 w-full rounded-lg transition-all duration-300 hover:bg-gray-200 focus:ring-2 focus:ring-[#2B7DFF]"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-100 border-none p-3 mb-4 w-full rounded-lg transition-all duration-300 hover:bg-gray-200 focus:ring-2 focus:ring-[#2B7DFF]"
              required
            />
            <button type="submit" className="rounded-full border border-[#2B7DFF] bg-[#2B7DFF] text-white text-xs font-bold py-3 px-12 uppercase tracking-wider transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Sign Up
            </button>
          </form>
        </div>

        {/* login form here ! */}
        <div 
          className={`absolute top-0 h-full transition-all duration-700 ease-in-out ${
            isRightPanelActive 
              ? 'w-1/2 -translate-x-full opacity-0' 
              : 'w-1/2 translate-x-0 opacity-100'
          }`}
        >
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-full bg-white px-12 text-center">
            <h1 className="font-bold text-2xl mb-2">Sign in</h1>
            <p className="text-gray-600 mb-8">Welcome back to your digital home!</p>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="bg-gray-100 border-none p-3 mb-2 w-full rounded-lg transition-all duration-300 hover:bg-gray-200 focus:ring-2 focus:ring-[#2B7DFF]"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-100 border-none p-3 mb-4 w-full rounded-lg transition-all duration-300 hover:bg-gray-200 focus:ring-2 focus:ring-[#2B7DFF]"
              required
            />
            <button type="submit" className="rounded-full border border-[#2B7DFF] bg-[#2B7DFF] text-white text-xs font-bold py-3 px-12 uppercase tracking-wider transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Sign In
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden">
          <div 
            className={`bg-gradient-to-r from-[#2B7DFF] to-[#5E9DFF] text-white relative -left-full h-full w-[200%] transition-transform duration-700 ease-in-out ${
              isRightPanelActive ? 'translate-x-1/2' : 'translate-x-0'
            }`}
          >
            {/* Left Overlay Panel */}
            <div 
              className={`absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-700 ease-in-out ${
                isRightPanelActive ? 'translate-x-0' : '-translate-x-[20%]'
              }`}
            >
              <h1 className="font-bold text-3xl mb-2">Welcome Back!</h1>
              <p className="mb-8 text-lg">Long time no see! Ready to continue your journey?</p>
              <button
                onClick={() => setIsRightPanelActive(false)}
                className="rounded-full border-2 border-white bg-transparent text-white text-xs font-bold py-3 px-12 uppercase tracking-wider transform transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#2B7DFF]"
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay Panel */}
            <div 
              className={`absolute flex items-center justify-center flex-col px-10 text-center top-0 right-0 h-full w-1/2 transition-transform duration-700 ease-in-out ${
                isRightPanelActive ? 'translate-x-[20%]' : 'translate-x-0'
              }`}
            >
              <h1 className="font-bold text-3xl mb-2">Hello, Friend!</h1>
              <p className="mb-8 text-lg">New here? Join us and start your amazing journey!</p>
              <button
                onClick={() => setIsRightPanelActive(true)}
                className="rounded-full border-2 border-white bg-transparent text-white text-xs font-bold py-3 px-12 uppercase tracking-wider transform transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#2B7DFF]"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div 
          className="absolute bottom-10 rounded-lg p-4 shadow-lg text-center text-sm transform transition-all duration-500 animate-fadeIn" 
          style={{ 
            backgroundColor: (typeof message === 'string' && message.includes('successful')) ? '#d4edda' : '#f8d7da',
            animation: 'slideUp 0.5s ease-out'
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AuthPage;