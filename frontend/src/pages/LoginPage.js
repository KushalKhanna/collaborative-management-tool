import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async ({ userName, password }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        userName,
        password
      });

      sessionStorage.setItem('loggedInUser', userName);
      toast.success('Login successful! Redirecting...', {
        autoClose: 3000,
        onClose: () => navigate('/dashboard'),
        closeButton: true,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error('Login failed. Please check your credentials. ' + error.response?.data?.message, {
        autoClose: 3000,
        closeButton: true,
        pauseOnHover: false,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 flex-col py-12 sm:px-6 lg:px-8">
      <ToastContainer />
      <AuthForm isLogin={true} onSubmit={handleSubmit} />
    </div>
  );
};

export default LoginPage;
