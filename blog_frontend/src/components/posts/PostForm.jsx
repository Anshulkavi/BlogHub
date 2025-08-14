// // import React, { useState, useEffect } from "react";
// // import { postsAPI } from "../../api/posts";
// // import LoadingSpinner from "../common/LoadingSpinner";
// // import TagInput from '../common/TagInput';
// // import CloudinaryUpload from "../common/CloudinaryUpload"; // ✅ Import CloudinaryUpload

// // const PostForm = ({ postId, onSuccess }) => {
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     content: "",
// //     excerpt: "",
// //     category: "",
// //     tags: [],
// //     featured_image: null, // This will now hold the Cloudinary URL
// //   });
// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [initialLoading, setInitialLoading] = useState(!!postId);

// //   useEffect(() => {
// //     fetchCategories();
// //     if (postId) fetchPost();
// //   }, [postId]);

// //   const fetchCategories = async () => {
// //     try {
// //       const data = await postsAPI.getCategories();
// //       setCategories(data);
// //     } catch (error) {
// //       console.error("Failed to fetch categories:", error);
// //     }
// //   };

// //   const fetchPost = async () => {
// //     try {
// //       const post = await postsAPI.getPost(postId);
// //       setFormData({
// //         title: post.title,
// //         content: post.content,
// //         excerpt: post.excerpt || "",
// //         category: post.category || "",
// //         tags: post.tags || [],
// //         featured_image: post.featured_image || null,
// //       });
// //     } catch (error) {
// //       setError("Failed to load post data.");
// //     } finally {
// //       setInitialLoading(false);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");

// //     try {
// //       const formPayload = new FormData();
// //       formPayload.append("title", formData.title);
// //       formPayload.append("content", formData.content);
// //       formPayload.append("excerpt", formData.excerpt);
// //       formPayload.append("category", formData.category);

// //       formData.tags.forEach(tag => formPayload.append("tags", tag));

// //       if (formData.featured_image) {
// //         formPayload.append("featured_image", formData.featured_image);
// //       }

// //       if (postId) await postsAPI.updatePost(postId, formPayload);
// //       else await postsAPI.createPost(formPayload);

// //       onSuccess();
// //     } catch (error) {
// //       setError(JSON.stringify(error.response?.data) || "Failed to save post.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value, files } = e.target;
// //     if (name === "featured_image") setFormData({ ...formData, [name]: files[0] });
// //     else setFormData({ ...formData, [name]: value });
// //   };

// //   const handleTagsChange = (newTags) => {
// //     setFormData(prev => ({ ...prev, tags: newTags }));
// //   };

// //   const handleCloudinaryUpload = (url) => {
// //     setFormData(prev => ({ ...prev, featured_image: url }));
// //   };

// //   if (initialLoading) return <LoadingSpinner />;

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-6">
// //       {error && (
// //         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
// //       )}

// //       <div>
// //         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
// //         <input
// //           type="text"
// //           id="title"
// //           name="title"
// //           required
// //           value={formData.title}
// //           onChange={handleChange}
// //           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //         />
// //       </div>

// //       <div>
// //         <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
// //         <textarea
// //           id="excerpt"
// //           name="excerpt"
// //           rows={3}
// //           value={formData.excerpt}
// //           onChange={handleChange}
// //           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //           placeholder="Brief description of your post..."
// //         />
// //       </div>

// //       <div>
// //         <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
// //         <textarea
// //           id="content"
// //           name="content"
// //           rows={12}
// //           required
// //           value={formData.content}
// //           onChange={handleChange}
// //           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //           placeholder="Write your post content here..."
// //         />
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div>
// //           <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
// //           <select
// //             id="category"
// //             name="category"
// //             value={formData.category}
// //             onChange={handleChange}
// //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //           >
// //             <option value="">Select a category</option>
// //             {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
// //           </select>
// //         </div>

// //         <div>
// //           <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
// //           <TagInput value={formData.tags} onChange={handleTagsChange} />
// //           <p className="text-xs text-gray-500 mt-1">Press Enter or click suggestions to add a tag.</p>
// //         </div>
// //       </div>

// //       <div>
// //         <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
// //         <CloudinaryUpload onUpload={handleCloudinaryUpload} />
// //         {formData.featured_image && (
// //           <p className="mt-2 text-sm text-gray-600">Uploaded image will be used as featured image.</p>
// //         )}
// //       </div>

// //       <div className="flex justify-end space-x-4">
// //         <button
// //           type="submit"
// //           disabled={loading}
// //           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
// //         >
// //           {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
// //         </button>
// //       </div>
// //     </form>
// //   );
// // };

// // export default PostForm;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { postsAPI } from "../../api/posts";
// import { useAuth } from "../../hooks/useAuth";

// const PostForm = ({ postId, onSuccess }) => {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [category, setCategory] = useState("");
//   const [featuredImage, setFeaturedImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { user, accessToken } = useAuth(); // make sure you have access token
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (postId) fetchPost();
//   }, [postId]);

//   const fetchPost = async () => {
//     try {
//       setLoading(true);
//       const post = await postsAPI.getPost(postId, accessToken);
//       setTitle(post.title);
//       setContent(post.content);
//       setCategory(post.category?.name || "");
//       // Don't set featuredImage here as file; handle it only if user uploads
//     } catch (err) {
//       console.error("Failed to fetch post:", err);
//       alert("Failed to load post. Try again.");
//       navigate("/");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("content", content);
//     formData.append("category", category);
//     if (featuredImage) formData.append("featured_image", featuredImage);

//     try {
//       await postsAPI.updatePost(postId, formData, accessToken);
//       onSuccess(); // navigate back to post detail
//     } catch (err) {
//       console.error("Failed to update post:", err.response?.data || err);
//       alert("Failed to update post. Check console for details.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label className="block font-medium mb-1">Title</label>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//           required
//         />
//       </div>

//       <div>
//         <label className="block font-medium mb-1">Content</label>
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//           rows={6}
//           required
//         />
//       </div>

//       <div>
//         <label className="block font-medium mb-1">Category</label>
//         <input
//           type="text"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//         />
//       </div>

//       <div>
//         <label className="block font-medium mb-1">Featured Image</label>
//         <input
//           type="file"
//           onChange={(e) => setFeaturedImage(e.target.files[0])}
//           accept="image/*"
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         disabled={loading}
//       >
//         {loading ? "Loading..." : postId ? "Update Post" : "Create Post"}
//       </button>
//     </form>
//   );
// };

// export default PostForm;

import React, { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { postsAPI } from "../../api/posts";
import TagInput from "../common/TagInput";
import CloudinaryUpload from "../common/CloudinaryUpload";
import LoadingSpinner from "../common/LoadingSpinner";

const PostForm = ({ postId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [],
    featured_image: null, // can be File object or URL string
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!postId);
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) =>
      setFormData((prev) => ({ ...prev, content: editor.getHTML() })),
  });

  useEffect(() => {
    fetchCategories();
    if (postId) fetchPost();
  }, [postId]);

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
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        category: post.category || "",
        tags: post.tags || [],
        featured_image: post.featured_image || null, // URL string
      });
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
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("content", formData.content);
      payload.append("excerpt", formData.excerpt);
      payload.append("category", formData.category);
      formData.tags.forEach((tag) => payload.append("tags", tag));

      // Conditional append for featured_image
      if (formData.featured_image instanceof File) {
        payload.append("featured_image", formData.featured_image);
      } else if (typeof formData.featured_image === "string") {
        payload.append("featured_image_url", formData.featured_image);
      }

      if (postId) await postsAPI.updatePost(postId, payload);
      else await postsAPI.createPost(payload);

      onSuccess();
    } catch (err) {
      setError(JSON.stringify(err.response?.data) || "Failed to save post.");
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
  };

  const handleTagsChange = (tags) =>
    setFormData((prev) => ({ ...prev, tags }));

  const handleCloudinaryUpload = (url) =>
    setFormData((prev) => ({ ...prev, featured_image: url }));

  if (initialLoading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto px-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          rows={3}
          value={formData.excerpt}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description of your post..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <div
          className="bg-white border border-gray-300 rounded-lg p-2"
          style={{ minHeight: "300px" }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <TagInput value={formData.tags} onChange={handleTagsChange} />
          <p className="text-xs text-gray-500 mt-1">
            Press Enter or click suggestions to add a tag.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image
        </label>

        {typeof formData.featured_image === "string" && (
          <div className="mb-2">
            <img
              src={formData.featured_image}
              alt="Featured"
              className="w-32 h-32 object-cover rounded-lg border"
            />
            <p className="text-sm text-gray-600 mt-1">
              Current image. Upload new to replace.
            </p>
          </div>
        )}

        <CloudinaryUpload onUpload={handleCloudinaryUpload} />

        {formData.featured_image instanceof File && (
          <p className="mt-2 text-sm text-gray-600">
            Uploaded image will be used as featured image.
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
