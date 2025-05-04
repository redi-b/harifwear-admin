import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {

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

        
          <Link
            to={'/order_status'}
            className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl w-full flex justify-between items-center"
          >
            Order status 
          </Link>
          
        

        <Link className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl text-left"
        
          to="/admin/dashboard/products">
          User account management
        </Link>
      </div>
      </div>
    
  );
};

export default Dashboard;

