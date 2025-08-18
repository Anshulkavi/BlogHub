import React, { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { postsAPI } from "../../api/posts";
import TagInput from "../common/TagInput";
import CloudinaryUpload from "../common/CloudinaryUpload";
import LoadingSpinner from "../common/LoadingSpinner";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { Strike } from "@tiptap/extension-strike";
import { Link } from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Heading } from "@tiptap/extension-heading";
import EditorToolbar from "./EditorToolbar";
import { Eye, Edit3, User, Calendar, Tag } from "lucide-react";
import { formatDate } from "../../utils/helpers";

// ContentRenderer Component
export const ContentRenderer = ({ content, className = "" }) => {
  return (
    <div
      className={`prose prose-slate max-w-none
         prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
         prose-h1:text-3xl prose-h1:leading-tight prose-h1:mb-6 prose-h1:mt-0
         prose-h2:text-2xl prose-h2:leading-tight prose-h2:mb-4 prose-h2:mt-8
         prose-h3:text-xl prose-h3:leading-tight prose-h3:mb-3 prose-h3:mt-6
         prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
         prose-strong:text-gray-900 prose-strong:font-bold
         prose-em:text-gray-700 prose-em:italic
         prose-u:underline prose-s:line-through
         prose-code:text-purple-700 prose-code:bg-purple-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
         prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
         prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-gray-700
         prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
         prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
         prose-li:text-gray-700 prose-li:mb-1 prose-li:leading-relaxed
         prose-a:text-blue-600 prose-a:underline prose-a:cursor-pointer hover:prose-a:text-blue-800
         prose-hr:border-0 prose-hr:h-px prose-hr:bg-gradient-to-r prose-hr:from-transparent prose-hr:via-gray-400 prose-hr:to-transparent prose-hr:my-8
         ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

const PostForm = ({
  postId,
  onSuccess,
  currentUser,
  onChange,
  forcePreviewMode = false,
  forceEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [],
    featured_image: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!postId);
  const [error, setError] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(forcePreviewMode);
  const [initialPostData, setInitialPostData] = useState(null); 


  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'tiptap-heading',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'tiptap-paragraph',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'tiptap-bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'tiptap-ordered-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'tiptap-list-item',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'tiptap-blockquote',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'tiptap-code-block',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'tiptap-code',
          },
        },
        bold: {
          HTMLAttributes: {
            class: 'tiptap-bold',
          },
        },
        italic: {
          HTMLAttributes: {
            class: 'tiptap-italic',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'tiptap-hr',
          },
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: 'tiptap-underline',
        },
      }),
      Strike.configure({
        HTMLAttributes: {
          class: 'tiptap-strike',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link text-blue-600 underline cursor-pointer hover:text-blue-800',
        },
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'tiptap-highlight',
        },
      }),
    ],
    content: formData.content || "<p></p>",
    onUpdate: ({ editor }) =>
      setFormData((prev) => ({ ...prev, content: editor.getHTML() })),
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content outline-none'
      }
    }
  });

  useEffect(() => {
    fetchCategories();
    if (postId) fetchPost();
  }, [postId]);

  // Update preview mode based on parent component
  useEffect(() => {
    if (forcePreviewMode !== undefined) {
      setIsPreviewMode(forcePreviewMode);
    }
    if (forceEditMode !== undefined) {
      setIsPreviewMode(!forceEditMode);
    }
  }, [forcePreviewMode, forceEditMode]);

  const fetchCategories = async () => {
    try {
      const data = await postsAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

const fetchPost = async () => {
  try {
    setInitialLoading(true);
    const post = await postsAPI.getPost(postId);
    const postData = {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      category: post.category || "",
      tags: post.tags || [],
      featured_image: post.featured_image || null,
    };
    setFormData(postData);
    setInitialPostData(postData); // ✅ SET THE INITIAL DATA HERE
    editor?.commands.setContent(post.content || "<p></p>");
  } catch (err) {
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
    // We will always send JSON now, since Cloudinary handles the file upload.
    const payload = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      category: formData.category,
      tags: formData.tags.map(tag => tag.name || tag),
    };

    if (postId) {
      // --- UPDATE LOGIC ---
      // Only include featured_image if it has changed from the initial state.
      if (formData.featured_image !== initialPostData.featured_image) {
        payload.featured_image = formData.featured_image;
      }
      await postsAPI.updatePost(postId, payload);
    } else {
      // --- CREATE LOGIC ---
      // Always include featured_image (it will be the URL or null).
      payload.featured_image = formData.featured_image;
      await postsAPI.createPost(payload);
    }

    onSuccess();
  } catch (err) {
    const errorData = err.response?.data;
    const errorMessage = errorData
      ? Object.entries(errorData).map(([key, value]) => `${key}: ${value}`).join('; ')
      : "Failed to save post.";
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "featured_image") {
      setFormData((prev) => ({ ...prev, featured_image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Call onChange callback if provided
    onChange?.();
  };

  const handleTagsChange = (tags) => {
    setFormData((prev) => ({ ...prev, tags }));
    onChange?.();
  };

  const handleCloudinaryUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      featured_image: url,
    }));
    onChange?.();
  };

  const getImageUrl = (imageValue) => {
    if (!imageValue) return null;

    if (imageValue instanceof File) {
      return URL.createObjectURL(imageValue);
    }

    if (typeof imageValue === 'string' && imageValue.startsWith('http')) {
      return imageValue;
    }

    // This case handles a Cloudinary public_id
    if (typeof imageValue === 'string' && imageValue.length > 0) {
      const cloudName = import.meta.env.VITE_CLOUD_NAME;
      if (cloudName) {
        return `https://res.cloudinary.com/${cloudName}/image/upload/${imageValue}`;
      }
    }

    return null;
  };

  const featuredImageUrl = getImageUrl(formData.featured_image);
  const authorName = currentUser?.full_name || currentUser?.profile?.full_name || "Anonymous";

  if (initialLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {isPreviewMode ? (
        /* PREVIEW MODE */
        <div className="space-y-8">
          {/* Preview Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 font-medium flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Preview Mode - This is how your post will look when published
            </p>
          </div>

          {/* Post Preview */}
          <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
            {/* Featured Image */}
            {featuredImageUrl && (
              <div className="relative overflow-hidden">
                <img
                  src={featuredImageUrl}
                  alt={formData.title || "Featured image"}
                  className="w-full h-64 md:h-80 object-cover"
                />
                {/* Category Badge */}
                {formData.category && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm">
                      {formData.category}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Meta Information */}
              <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{authorName}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(new Date())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {formData.title || "Your post title will appear here"}
              </h1>

              {/* Excerpt */}
              {formData.excerpt && (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed font-light">
                  {formData.excerpt}
                </p>
              )}

              {/* Tags */}
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      #{tag.name || tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="border-t border-gray-100 pt-8">
                {formData.content && formData.content !== "<p></p>" ? (
                  <ContentRenderer
                    content={formData.content}
                    className="prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-0 prose-h1:leading-tight prose-h1:text-gray-900"
                  />
                ) : (
                  <div className="text-gray-500 italic text-center py-12">
                    Your post content will appear here. Switch to Edit mode to start writing.
                  </div>
                )}
              </div>
            </div>
          </article>
        </div>
      ) : (
        /* EDIT MODE */
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your post title"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of your post..."
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <EditorToolbar editor={editor} />
              <div className="border-t border-gray-200">
                <EditorContent
                  editor={editor}
                  className="tiptap-editor min-h-[300px] p-4 focus-within:outline-none prose prose-slate max-w-none
                      prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                      prose-h1:text-3xl prose-h1:leading-tight prose-h1:mb-4 prose-h1:mt-6
                      prose-h2:text-2xl prose-h2:leading-tight prose-h2:mb-3 prose-h2:mt-5
                      prose-h3:text-xl prose-h3:leading-tight prose-h3:mb-3 prose-h3:mt-4
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                      prose-strong:text-gray-900 prose-strong:font-bold
                      prose-em:text-gray-700 prose-em:italic
                      prose-code:text-purple-700 prose-code:bg-purple-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-gray-700
                      prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                      prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                      prose-li:text-gray-700 prose-li:mb-1 prose-li:leading-relaxed
                      prose-a:text-blue-600 prose-a:underline prose-a:cursor-pointer hover:prose-a:text-blue-800
                      prose-hr:border-0 prose-hr:h-px prose-hr:bg-gradient-to-r prose-hr:from-transparent prose-hr:via-gray-400 prose-hr:to-transparent prose-hr:my-8
                      [&_.tiptap-underline]:underline [&_.tiptap-strike]:line-through
                      [&_.tiptap-highlight]:px-1 [&_.tiptap-highlight]:py-0.5 [&_.tiptap-highlight]:rounded
                      [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]
                      [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:mt-6
                      [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:mt-5
                      [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:mb-3 [&_.ProseMirror_h3]:mt-4"
                />
              </div>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <TagInput value={formData.tags} onChange={handleTagsChange} />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>

            {/* Preview */}
            {featuredImageUrl && (
              <div className="mb-3">
                <img
                  src={featuredImageUrl}
                  alt="Featured"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Cloudinary Upload */}
            <CloudinaryUpload onUpload={handleCloudinaryUpload} buttonText="Upload Image to Cloudinary" />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostForm;