import React from 'react';

const PostCardSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-pulse">
      {/* Title Placeholder */}
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      
      {/* Content Placeholders */}
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>

      <div className="flex items-center justify-between mt-4">
        {/* Tags Placeholder */}
        <div className="flex items-center space-x-2">
          <div className="h-5 bg-gray-200 rounded-full w-12"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
        
        {/* Likes/Date Placeholder */}
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 rounded w-8"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;