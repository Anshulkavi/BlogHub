import React from "react";
import { Link } from "react-router-dom";
import { Heart, User, Calendar, Tag } from "lucide-react";
import { formatDate } from "../../utils/helpers";

const PostCard = ({ post, onLike, onTagClick, user }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.featured_image && (
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onLike(post.id)}
              disabled={!user}
              className={`flex items-center space-x-1 text-sm ${
                post.is_liked ? "text-red-600" : "text-gray-600"
              } ${
                user
                  ? "hover:text-red-600 cursor-pointer"
                  : "cursor-not-allowed"
              } transition-colors`}
            >
              <Heart
                className={`w-4 h-4 ${post.is_liked ? "fill-current" : ""}`}
              />
              <span>{post.likes_count || 0}</span>
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link
            to={`/post/${post.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt || post.content?.substring(0, 150) + "..."}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm text-gray-700">
              {post.author?.profile?.full_name || "Anonymous"}
            </span>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <button
                key={tag.id || tag}
                onClick={() => onTagClick(tag.name || tag)}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name || tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
