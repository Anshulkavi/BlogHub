import React, { useState, useEffect } from "react";
import { postsAPI } from "../../api/posts";
import LoadingSpinner from "../common/LoadingSpinner";
import TagInput from '../common/TagInput'; // Make sure this path is correct

const PostForm = ({ postId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "", // This will now store the category NAME
    tags: [], // ✅ Always an array
    featured_image: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(!!postId);

  useEffect(() => {
    fetchCategories();
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchCategories = async () => {
    try {
      const data = await postsAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchPost = async () => {
    try {
      const post = await postsAPI.getPost(postId);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        category: post.category || "", // ✅ Directly use the category name
        tags: post.tags || [], // ✅ Store tags as an array of strings
        featured_image: null, // Image is not pre-filled for editing
      });
    } catch (error) {
      setError("Failed to load post data.");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("content", formData.content);
      formPayload.append("excerpt", formData.excerpt);
      formPayload.append("category", formData.category);

      // ✅ Directly iterate over the tags array
      formData.tags.forEach((tag) => formPayload.append("tags", tag));

      if (formData.featured_image) {
        formPayload.append("featured_image", formData.featured_image);
      }

      if (postId) {
        await postsAPI.updatePost(postId, formPayload);
      } else {
        await postsAPI.createPost(formPayload);
      }

      onSuccess();
    } catch (error) {
      setError(JSON.stringify(error.response?.data) || "Failed to save post.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handler for standard input fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "featured_image") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Dedicated handler for the TagInput component
  const handleTagsChange = (newTags) => {
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          value={formData.excerpt}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description of your post..."
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          required
          value={formData.content}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Write your post content here..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          {/* 👇 REPLACED THE OLD INPUT WITH THE NEW COMPONENT 👇 */}
          <TagInput 
            value={formData.tags}
            onChange={handleTagsChange}
          />
          <p className="text-xs text-gray-500 mt-1">Press Enter or click suggestions to add a tag.</p>
        </div>
      </div>

      <div>
        <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image
        </label>
        <input
          type="file"
          id="featured_image"
          name="featured_image"
          accept="image/*"
          onChange={handleChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
};

export default PostForm;