const AdminPage = () => {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-xl text-gray-300">Welcome to the admin panel</p>
        <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
          <p className="text-gray-300">Admin-only content goes here</p>
        </div>
      </div>
    );
  };
  
  export default AdminPage;