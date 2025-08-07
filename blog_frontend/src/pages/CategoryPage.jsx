import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../api/posts';
import PostCard from '../components/common/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CategoryPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams(); // Gets the slug from the URL (e.g., 'technology')

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        setLoading(true);
        const data = await postsAPI.getPostsByCategorySlug(slug);
        setPosts(data);
      } catch (error) {
        console.error(`Failed to fetch posts for category ${slug}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryPosts();
  }, [slug]); // Re-fetch if the slug in the URL changes

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        Posts in: {slug.replace(/-/g, ' ')}
      </h1>
      
      {loading ? (
        <LoadingSpinner />
      ) : posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;