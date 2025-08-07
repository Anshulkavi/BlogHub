import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/posts/PostForm';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
        <p className="text-gray-600">Make changes to your post</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <PostForm postId={id} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default EditPostPage;
