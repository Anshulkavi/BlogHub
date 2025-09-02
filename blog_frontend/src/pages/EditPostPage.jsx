// Updated EditPostPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Edit3, 
  Clock,
  AlertCircle,
  CheckCircle,
  History,
  Trash2
} from 'lucide-react';
import PostForm from '../components/posts/PostForm';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const postFormRef = useRef();

  useEffect(() => {
    // Set up auto-save interval
    const interval = setInterval(() => {
      if (hasUnsavedChanges) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [hasUnsavedChanges]);

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSuccess = () => {
    navigate(`/post/${id}`, { 
      state: { 
        message: 'Post updated successfully!', 
        type: 'success' 
      } 
    });
  };

  const handleDelete = async () => {
    try {
      // Add your delete post logic here
      // await postsAPI.deletePost(id);
      navigate('/', { 
        state: { 
          message: 'Post deleted successfully!', 
          type: 'success' 
        } 
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const formatLastSaved = (date) => {
    if (!date) return 'Never saved';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to={`/post/${id}`}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Post</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Edit Post</h1>
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-1 text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Unsaved changes</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Preview Toggle Buttons */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    !isPreviewMode
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setIsPreviewMode(true)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isPreviewMode
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              </div>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <div className="flex items-center space-x-2 text-sm">
                {hasUnsavedChanges ? (
                  <div className="flex items-center space-x-1 text-amber-600">
                    <Clock className="w-4 h-4" />
                    <span>Auto-saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Saved {formatLastSaved(lastSaved)}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isPreviewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Form Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Edit3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Edit Your Post
                        </h2>
                        <p className="text-sm text-gray-600">
                          Make changes to improve your content
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 rounded-md hover:bg-white/50 transition-colors">
                        <History className="w-3 h-3" />
                        <span>Version History</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6">
                  <PostForm 
                    postId={id} 
                    onSuccess={handleSuccess}
                    onChange={() => setHasUnsavedChanges(true)}
                    ref={postFormRef}
                    forceEditMode={!isPreviewMode}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Edit Tips */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center space-x-2">
                      <Edit3 className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Edit Tips</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="text-sm">
                      <h4 className="font-medium text-gray-900 mb-2">Improve engagement:</h4>
                      <ul className="space-y-1 text-gray-600 text-xs">
                        <li>• Add compelling visuals</li>
                        <li>• Break up long paragraphs</li>
                        <li>• Use descriptive subheadings</li>
                        <li>• Update outdated information</li>
                      </ul>
                    </div>
                    <div className="text-sm">
                      <h4 className="font-medium text-gray-900 mb-2">SEO optimization:</h4>
                      <ul className="space-y-1 text-gray-600 text-xs">
                        <li>• Optimize title and tags</li>
                        <li>• Add alt text to images</li>
                        <li>• Include relevant keywords</li>
                        <li>• Write a compelling excerpt</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Post Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Post Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Views</span>
                      <span className="text-sm font-medium text-gray-900">247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Likes</span>
                      <span className="text-sm font-medium text-gray-900">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Comments</span>
                      <span className="text-sm font-medium text-gray-900">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Shares</span>
                      <span className="text-sm font-medium text-gray-900">3</span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-3">
                    Deleting this post is permanent and cannot be undone.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode - Full Width */
          <PostForm 
            postId={id} 
            onSuccess={handleSuccess}
            onChange={() => setHasUnsavedChanges(true)}
            ref={postFormRef}
            forcePreviewMode={isPreviewMode}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Post</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this post? All comments and likes will be permanently removed.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className="bg-gray-100 text-center py-4 mt-8 border-t">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} blogHub. All rights reserved.
      </p>
    </footer>
    </div>
    
  );
};

export default EditPostPage;