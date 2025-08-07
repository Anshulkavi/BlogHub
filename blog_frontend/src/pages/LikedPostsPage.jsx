// src/pages/LikedPostsPage.jsx

import React, { useState, useEffect } from 'react';
import { postsAPI } from '../api/posts';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/common/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LikedPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Needed for the PostCard user prop

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        setLoading(true);
        const data = await postsAPI.getLikedPosts();
        setPosts(data.results || data);
      } catch (error) {
        console.error('Failed to fetch liked posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLikedPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Liked Posts</h1>
        <p className="text-gray-600 mt-1">Posts you've shown some love for.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">You haven't liked any posts yet.</p>
          <p className="text-sm text-gray-500">Go ahead and like some posts to see them here!</p>
        </div>
      )}
    </div>
  );
};

export default LikedPostsPage;