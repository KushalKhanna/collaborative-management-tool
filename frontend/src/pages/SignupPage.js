import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async ({ name, userName, password }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', {
        name,
        userName,
        password
      });

      console.log('Signup response:', response.data);

      // Show success toast and redirect only after it closes
      toast.success('Account created successfully! Redirecting to login...', {
        autoClose: 3000,
        onClose: () => navigate('/login'),
        closeButton: true,
        pauseOnHover: false,
      });

    } catch (error) {
      toast.error('Signup failed.' + error.response?.data?.message + 'Please try again.', {
        autoClose: 3000,
        closeButton: true,
        pauseOnHover: false,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 flex-col py-12 sm:px-6 lg:px-8">
      <ToastContainer />
      <AuthForm isLogin={false} onSubmit={handleSubmit} />
    </div>
  );
};

export default SignupPage;