import React from "react";
import { Table, ShoppingBag } from "lucide-react"; // Importing icons

const Footer = () => {
  return (
    <div className="w-full bg-[#F8F6F0] fixed bottom-0 left-0 z-50 shadow-lg">
      <div className="container mx-auto h-20 flex justify-center items-center gap-8 text-lg font-semibold text-gray-800">
        
        {/* Find a Table */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:text-blue-600 transition-all">
          <Table className="w-6 h-6" />
          Find a Table
        </button>

        <span className="text-gray-500">|</span>

        {/* Order Takeaway */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:text-green-600 transition-all">
          <ShoppingBag className="w-6 h-6" />
          Order Takeaway
        </button>
        
      </div>
    </div>
  );
};

export default Footer;
