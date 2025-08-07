import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-2xl font-light text-gray-600 mt-4">
        Oops! Page Not Found.
      </p>
      <p className="text-md text-gray-500 mt-2">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;