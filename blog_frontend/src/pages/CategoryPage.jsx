// src/pages/CategoryPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag, FileText, RefreshCw } from 'lucide-react';
import { postsAPI } from '../api/posts';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/common/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CategoryPage = () => {
  const { user } = useAuth();
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Format category name from slug
  const categoryName = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

  const fetchCategoryPosts = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await postsAPI.getPostsByCategorySlug(slug);
      setPosts(data.results || data);
    } catch (error) {
      console.error(`Failed to fetch posts for category ${slug}:`, error);
      setError(error.response?.data?.detail || `Failed to load posts for category "${categoryName}"`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [slug, categoryName]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCategoryPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId) => {
    if (!user) return;
    
    try {
      await postsAPI.likePost(postId);
      // Refresh posts to update like status
      await fetchCategoryPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
      setError('Failed to update post. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleTagClick = (tag) => {
    // Navigate to tag page or filter posts by tag
    console.log('Tag clicked:', tag);
  };

  useEffect(() => {
    fetchCategoryPosts();
  }, [fetchCategoryPosts]);

  if (!slug) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Category</h1>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>
    );
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
            <div className="p-2 bg-blue-100 rounded-full">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {categoryName}
              </h1>
              <p className="text-gray-600 mt-1">
                Explore posts in this category • {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
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
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts in "{categoryName}" yet
            </h3>
            <p className="text-gray-600 mb-6">
              This category is waiting for its first post. Be the first to contribute!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Post
              </Link>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Browse All Posts
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;