// Fixed PostCard Component with better image handling
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Calendar, 
  Tag, 
  User, 
  Eye, 
  MessageSquare,
  Share2,
  BookmarkPlus,
  MoreHorizontal
} from "lucide-react";
import { formatDate } from "../../utils/helpers";

const PostCard = ({ post, onLike, onTagClick, user, onBookmark, onShare }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const authorName = post.author?.profile?.full_name || post.author?.full_name || "Anonymous";
  
  // Fixed image URL handling
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    if (!cloudName) {
      console.warn("Cloudinary cloud name is undefined!");
      return null;
    }
    return `https://res.cloudinary.com/${cloudName}/image/upload/${imageUrl}`;
  };

  const authorImage = getImageUrl(post.author?.profile?.profile_picture);
  const featuredImage = getImageUrl(post.featured_image);

  const stripHtml = (html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const excerpt = post.excerpt || 
    (stripHtml(post.content)?.substring(0, 150) + 
    (stripHtml(post.content)?.length > 150 ? "..." : ""));

  const handleLike = async () => {
    if (!user || isLiking) return;
    setIsLiking(true);
    try {
      await onLike(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: excerpt,
        url: window.location.origin + `/post/${post.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
    }
    onShare?.(post.id);
  };

  const readingTime = Math.ceil(stripHtml(post.content)?.split(' ').length / 200) || 1;

  return (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 ease-out">
      {/* Featured Image */}
      {featuredImage && !imageError && (
        <div className="relative overflow-hidden bg-gray-100">
          <Link to={`/post/${post.id}`} className="block">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={featuredImage}
                alt={post.title}
                className={`w-full h-48 object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(false);
                }}
              />
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Loading...</div>
                </div>
              )}
            </div>
          </Link>
          
          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm">
                {post.category}
              </span>
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-2">
              <button
                onClick={handleShare}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                title="Share post"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
              {onBookmark && (
                <button
                  onClick={() => onBookmark(post.id)}
                  className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                  title="Bookmark post"
                >
                  <BookmarkPlus className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header Meta */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {authorImage && !imageError ? (
                <img
                  src={authorImage}
                  alt={authorName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-100"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{authorName}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.created_at)}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                  <button className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                    Report
                  </button>
                  <button className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                    Hide
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-3 leading-tight">
          <Link
            to={`/post/${post.id}`}
            className="text-gray-900 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-sm line-clamp-2"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <button
                key={tag.id || tag || index}
                onClick={() => onTagClick?.(tag.name || tag)}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
              >
                <Tag className="w-3 h-3 mr-1" />
                #{tag.name || tag}
              </button>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={!user || isLiking}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                post.is_liked
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
              } ${
                !user ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              } focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1`}
            >
              <Heart 
                className={`w-4 h-4 transition-transform ${
                  isLiking ? 'scale-110' : ''
                } ${post.is_liked ? "fill-current" : ""}`} 
              />
              <span>{post.likes_count || 0}</span>
            </button>

            {/* Comments */}
            {post.comments_count !== undefined && (
              <Link
                to={`/post/${post.id}#comments`}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments_count || 0}</span>
              </Link>
            )}
          </div>

          {/* Read More */}
          <Link
            to={`/post/${post.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 rounded px-2 py-1"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;