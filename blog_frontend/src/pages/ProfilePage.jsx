import React, { useState, useEffect, useCallback } from "react";
import { User, Edit2, Save, X, Mail, Phone, FileText } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { postsAPI } from "../api/posts";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PostCard from "../components/common/PostCard";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    profile_picture: null,
  });

  const fetchUserPosts = useCallback(async () => {
    // This is the "Guard Clause"
    if (!user || !user.id) {
      // DEBUG LOG 1: This will show if the function is stopping correctly
      // console.log("GUARD CLAUSE ACTIVATED: Stopping post fetch because user.id is not ready.");
      setPostsLoading(false);
      return;
    }

    try {
      setPostsLoading(true);
      // DEBUG LOG 2: This will show the successful API call attempt
      // console.log(`MAKING API CALL: Fetching posts for user ID: ${user.id}`);
      const data = await postsAPI.getPostsByUser(user.id);
      setUserPosts(data);
    } catch (error) {
      // console.error("Failed to fetch user posts:", error);
      setUserPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // DEBUG LOG 3: This shows us when the effect runs and what 'user' contains
    // console.log("useEffect running. Current user object:", user);

    if (user) {
      setFormData({
        full_name: user.full_name || "",
        bio: user.bio || "",
        profile_picture: null,
      });
      fetchUserPosts();
    }
  }, [user, fetchUserPosts]);


  // All other functions (handleSubmit, etc.) remain the same
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); setError(""); setSuccess(""); try { await updateProfile(formData); setSuccess("Profile updated successfully!"); setIsEditing(false); setTimeout(() => setSuccess(""), 3000); } catch (error) { setError(error.response?.data?.detail || "Failed to update profile"); } finally { setLoading(false); } };
  const handleChange = (e) => { const { name, value, files } = e.target; setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value, })); };
  const handleCancel = () => { if (user) { setFormData({ full_name: user.full_name || "", bio: user.bio || "", profile_picture: null, }); } setIsEditing(false); setError(""); };
  const handleLike = async (postId) => { try { await postsAPI.likePost(postId); fetchUserPosts(); } catch (error) { console.error("Failed to like post:", error); } };


  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-4 sm:mb-0">
              <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.full_name}
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.full_name || user.username}
                  </h1>
                  <p className="text-gray-600">@{user.username}</p>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details / Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isEditing ? "Edit Profile" : "Profile Details"}
            </h2>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    id="profile_picture"
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                {user.bio && (
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Bio</p>
                      <p className="text-gray-900">{user.bio}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Posts</span>
                    <span className="font-semibold text-gray-900">
                      {userPosts.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Posts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              My Posts
            </h2>

            {postsLoading ? (
              <LoadingSpinner />
            ) : userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                    <PostCard
                      post={post}
                      onLike={handleLike}
                      onTagClick={() => {}}
                      user={user}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No posts yet</p>
                <p className="text-gray-500 text-sm mb-4">
                  Start sharing your thoughts with the world!
                </p>
                <a
                  href="/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Write Your First Post
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="bg-gray-100 text-center py-4 mt-8 border-t">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} blogHub. All rights reserved.
      </p>
    </footer>
    </div>
  );
};

export default ProfilePage;