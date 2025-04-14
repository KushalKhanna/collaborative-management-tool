// import { useNavigate } from 'react-router-dom';

// const HomePage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="h-screen bg-gray-900 text-white overflow-hidden">
//       <div className="h-full flex flex-col">
//         {/* Hero Section - 40% of viewport */}
//         <section className="h-[40vh] flex items-center justify-center px-4">
//           <div className="text-center max-w-3xl mx-auto">
//             <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
//               Welcome to Our Platform
//             </h1>
//             <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6">
//               Discover amazing features and services tailored just for you.
//             </p>
//             <div className="flex flex-col sm:flex-row justify-center gap-3">
//               <button 
//                 onClick={() => navigate('/login')}
//                 className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-xs sm:text-sm"
//               >
//                 Get Started
//               </button>
//               <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md font-medium text-xs sm:text-sm">
//                 Learn More
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* Features Section - 40% of viewport */}
//         <section className="h-[40vh] px-4 flex items-center">
//           <div className="w-full mx-auto">
//             <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Key Features</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
//               <div className="bg-gray-800 p-4 rounded-lg text-center">
//                 <div className="text-blue-400 text-2xl mb-2">🔒</div>
//                 <h3 className="text-sm sm:text-base font-semibold mb-1">Secure Access</h3>
//                 <p className="text-xs sm:text-sm text-gray-300">
//                   Robust authentication protection
//                 </p>
//               </div>
              
//               <div className="bg-gray-800 p-4 rounded-lg text-center">
//                 <div className="text-blue-400 text-2xl mb-2">⚡</div>
//                 <h3 className="text-sm sm:text-base font-semibold mb-1">Fast Performance</h3>
//                 <p className="text-xs sm:text-sm text-gray-300">
//                   Optimized for speed
//                 </p>
//               </div>
              
//               <div className="bg-gray-800 p-4 rounded-lg text-center">
//                 <div className="text-blue-400 text-2xl mb-2">🔄</div>
//                 <h3 className="text-sm sm:text-base font-semibold mb-1">Easy Integration</h3>
//                 <p className="text-xs sm:text-sm text-gray-300">
//                   Connect with existing tools
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* CTA Section - 20% of viewport */}
//         <section className="h-[20vh] flex items-center justify-center px-4">
//           <div className="text-center">
//             <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Ready to get started?</h2>
//             <button 
//               onClick={() => navigate('/login')}
//               className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2 rounded-md font-medium text-xs sm:text-sm"
//             >
//               Sign Up Now
//             </button>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default HomePage;


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold mb-6">Welcome to Our Platform</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing features and services tailored just for you.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Get Started
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-md font-medium transition-colors">
              Learn More
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-blue-400 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-gray-300">
                Robust authentication to keep your data safe and protected.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-blue-400 text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Performance</h3>
              <p className="text-gray-300">
                Optimized for speed so you can get things done without waiting.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-blue-400 text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-gray-300">
                Seamlessly connect with your existing tools and workflows.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-800 rounded-xl p-12 text-center my-12">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users today.
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-md font-medium text-lg transition-colors"
          >
            Sign Up Now
          </button>
        </section>
      </div>
    </div>
  );
};

export default HomePage;