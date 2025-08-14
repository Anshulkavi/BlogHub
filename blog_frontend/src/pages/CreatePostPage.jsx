import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/posts/PostForm';

const CreatePostPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
        <p className="text-gray-600">Share your thoughts with the world</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <PostForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreatePostPage;
