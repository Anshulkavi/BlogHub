
// src/pages/LikedPostsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Heart, ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../api/posts';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/common/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LikedPostsPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchLikedPosts = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await postsAPI.getLikedPosts();
      setPosts(data.results || data);
    } catch (error) {
      console.error('Failed to fetch liked posts:', error);
      setError(error.response?.data?.detail || 'Failed to load liked posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLikedPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId) => {
    try {
      await postsAPI.likePost(postId);
      // Remove the unliked post from the list
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Failed to unlike post:', error);
      setError('Failed to update post. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleTagClick = (tag) => {
    // Navigate to tag page or filter posts by tag
    console.log('Tag clicked:', tag);
  };

  useEffect(() => {
    fetchLikedPosts();
  }, [fetchLikedPosts]);

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Feed
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-full">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Liked Posts</h1>
              <p className="text-gray-600 mt-1">
                Posts you've shown some love for • {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <PostCard
                post={post}
                onLike={handleLike}
                onTagClick={handleTagClick}
                user={user}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No liked posts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring and liking posts to see them here. Your favorite content will be saved for easy access.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Posts
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikedPostsPage;