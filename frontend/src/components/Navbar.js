import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    try {
      // const response = await axios.post('http://localhost:5000/api/users/signup', {
      //   name,
      //   userName,
      //   password
      // });

      // console.log('Signup response:', response.data);

      localStorage.removeItem("loggedInUser");
      toast.success('Logged out successfully! Redirecting to login...', {
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
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo on left */}
          <div className="flex items-center">
            <div className="text-white font-bold text-xl mr-4">Story Time</div>
          </div>
          
          {/* Search bar in middle - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right side - desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 bg-transparent hover:bg-gray-800 rounded-full text-white font-medium transition-colors border border-gray-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          
          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <HamburgerIcon isOpen={isOpen} />
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      <div className={`fixed top-0 left-0 right-0 h-screen bg-gray-900/95 z-40 pt-20 transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 flex flex-col space-y-6">
          {/* Mobile Search - visible only when menu is open */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          <MobileNavLink href="#" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
          <MobileNavLink href="#" onClick={() => setIsOpen(false)}>Sports</MobileNavLink>
          <MobileNavLink href="#" onClick={() => setIsOpen(false)}>Bookings</MobileNavLink>
          <MobileNavLink href="#" onClick={() => setIsOpen(false)}>About</MobileNavLink>
          <button className="mt-4 px-6 py-3 bg-transparent hover:bg-gray-800 rounded-full text-white font-medium w-full border border-gray-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

// Sub-components (unchanged from your original)
const MobileNavLink = ({ href, onClick, children }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="text-2xl text-white hover:text-green-400 transition-colors py-2 block"
  >
    {children}
  </a>
);

const HamburgerIcon = ({ isOpen }) => (
  <svg 
    className="w-6 h-6 transition-transform duration-300"
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    {isOpen ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    )}
  </svg>
);

export default Navbar;