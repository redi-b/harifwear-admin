import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 text-black">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Dashbaord for managing Harifwear orders and operations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/orders"
            className="w-full max-w-xl p-6 transition bg-white border border-orange-100 shadow-sm rounded-2xl hover:shadow-md hover:bg-orange-50"
          >
            <h2 className="text-lg font-medium text-orange-700">
              Order Management
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              View, update, and track customer orders.
            </p>
          </Link>

          <div className="w-full max-w-xl p-6 transition border border-gray-300 border-dashed shadow-sm rounded-2xl">
            <h2 className="text-lg font-medium text-orange-700">
              User Management
            </h2>
            <p className="mt-1 text-sm text-gray-600">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
