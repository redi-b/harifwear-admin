import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-center px-4 overflow-x-hidden overflow-y-auto min-h-screen sm:px-6 md:px-12">
        <div className="w-full max-w-md p-6 text-center rounded-lg md:max-w-2xl">
          <h1 className="mb-4 text-6xl font-bold text-orange-600 sm:text-8xl">
            404
          </h1>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Oops! Page Not Found
          </h2>
          <p className="mb-6 text-sm text-gray-700">
            The page you’re looking for doesn’t exist or has been moved. Let’s
            get you back on track!
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-all duration-300 bg-orange-500 rounded-md shadow hover:bg-orange-600 hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
