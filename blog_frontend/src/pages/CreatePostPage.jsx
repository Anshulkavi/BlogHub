// Updated CreatePostPage.js
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  FileText, 
  Lightbulb,
  Clock,
  Target,
  Edit3
} from 'lucide-react';
import PostForm from '../components/posts/PostForm';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const postFormRef = useRef();

  const handleSuccess = () => {
    navigate('/', { 
      state: { 
        message: 'Post created successfully!', 
        type: 'success' 
      } 
    });
  };

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
    // Pass the preview state to PostForm if it has a method to handle it
    if (postFormRef.current && postFormRef.current.setPreviewMode) {
      postFormRef.current.setPreviewMode(!isPreviewMode);
    }
  };

  const tips = [
    {
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      title: "Write a compelling title",
      description: "Make it clear, specific, and attention-grabbing"
    },
    {
      icon: <Target className="w-5 h-5 text-green-500" />,
      title: "Add relevant tags",
      description: "Help readers discover your content with descriptive tags"
    },
    {
      icon: <Eye className="w-5 h-5 text-purple-500" />,
      title: "Include visuals",
      description: "Featured images make your post more engaging"
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      title: "Preview before publishing",
      description: "Review your post to ensure it looks perfect"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Posts</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Create New Post</h1>
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
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Save className="w-4 h-4" />
                <span>Auto-saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full width for PostForm */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isPreviewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Form Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Share Your Story
                      </h2>
                      <p className="text-sm text-gray-600">
                        Create engaging content that resonates with your audience
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6">
                  <PostForm 
                    onSuccess={handleSuccess} 
                    ref={postFormRef}
                    forceEditMode={!isPreviewMode}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Writing Tips */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold text-gray-900">Writing Tips</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {tips.map((tip, index) => (
                        <div key={index} className="flex space-x-3">
                          <div className="flex-shrink-0">
                            {tip.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              {tip.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {tip.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Words</span>
                      <span className="text-sm font-medium text-gray-900">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Characters</span>
                      <span className="text-sm font-medium text-gray-900">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reading time</span>
                      <span className="text-sm font-medium text-gray-900">~1 min</span>
                    </div>
                  </div>
                </div>

                {/* Shortcuts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Shortcuts</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bold</span>
                      <span className="font-mono text-gray-900">Ctrl + B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Italic</span>
                      <span className="font-mono text-gray-900">Ctrl + I</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Link</span>
                      <span className="font-mono text-gray-900">Ctrl + K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Save</span>
                      <span className="font-mono text-gray-900">Ctrl + S</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode - Full Width */
          <PostForm 
            onSuccess={handleSuccess} 
            ref={postFormRef}
            forcePreviewMode={isPreviewMode}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePostPage;