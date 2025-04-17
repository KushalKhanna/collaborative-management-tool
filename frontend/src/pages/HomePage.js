import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold mb-6">Welcome to Story Time!</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Collobrate with your friends to write amazing stories! 
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Get Started
            </button>
            {/*
            <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-md font-medium transition-colors">
              Learn More
            </button>
            */}
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