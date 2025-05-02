import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleLink = (status: string) => () => {
    setShowDropdown(false);
    
     window.location.href =`${status.toLowerCase()}_orders`;
  };

  return (
    <div className="min-h-screen  text-black p-8">

      <div className="flex flex-col gap-4 max-w-sm">
        
        <Link className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl text-left"
        
          to="/normal_orders">
          Normal orders
        </Link>

        
        <Link className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl text-left"
        
          to="/custom_orders">
          Custom orders
        </Link>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl w-full flex justify-between items-center"
          >
            Order status <FaChevronDown className="ml-2" />
          </button>

          {showDropdown && (
            <div className="relative left-0 right-0 mt-2 bg-orange-600 rounded-xl shadow-lg z-10 overflow-hidden">
              {["Purchased", "Shipped", "Delivered", "Cancelled", "Declined by admin"].map(
                (status) => (
                  <button
                  
                    key={status}
                    className="w-full text-left px-6 py-3 hover:bg-orange-700"
                    onClick={handleLink(status)}
                  >
                    {status}
                  
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <Link className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl text-left"
        
          to="/admin/dashboard/products">
          User account management
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

