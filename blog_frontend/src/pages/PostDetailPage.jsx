// // // import React, { useState, useEffect } from 'react';
// // // import { useParams, useNavigate, Link } from 'react-router-dom';
// // // import { Heart, Edit, User, Calendar, Tag, ArrowLeft } from 'lucide-react';
// // // import { postsAPI } from '../api/posts';
// // // import { useAuth } from '../hooks/useAuth';
// // // import LoadingSpinner from '../components/common/LoadingSpinner';
// // // import { formatDateLong } from '../utils/helpers';

// // // const PostDetailPage = () => {
// // //   const { id } = useParams();
// // //   const [post, setPost] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const { user } = useAuth();
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     fetchPost();
// // //   }, [id]);

// // //   const fetchPost = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const data = await postsAPI.getPost(id);
// // //       setPost(data);
// // //     } catch (error) {
// // //       console.error('Failed to fetch post:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleLike = async () => {
// // //     if (!user) {
// // //       navigate('/login');
// // //       return;
// // //     }

// // //     const originalPost = { ...post };

// // //     setPost(currentPost => ({
// // //       ...currentPost,
// // //       is_liked: !currentPost.is_liked,
// // //       likes_count: currentPost.is_liked ? currentPost.likes_count - 1 : currentPost.likes_count + 1
// // //     }));

// // //     try {
// // //       await postsAPI.likePost(id);
// // //     } catch (error) {
// // //       console.error("Failed to like post, reverting UI:", error);
// // //       setPost(originalPost);
// // //       alert("Something went wrong, please try liking again.");
// // //     }
// // //   };

// // //   if (loading) return <LoadingSpinner />;

// // //   if (!post) {
// // //     return (
// // //       <div className="max-w-4xl mx-auto px-4 py-8 text-center">
// // //         <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
// // //         <Link to="/" className="text-blue-600 hover:text-blue-700">
// // //           Return to home
// // //         </Link>
// // //       </div>
// // //     );
// // //   }

// // //   const authorName = post.author?.profile?.full_name || 'Anonymous';
// // //   const authorProfilePic = post.author?.profile?.profile_picture;

// // //   return (
// // //     <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
// // //       <div className="mb-8">
// // //         <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>

// // //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-y border-gray-200 py-4">
// // //           <div className="flex items-center space-x-4 mb-4 sm:mb-0">
// // //             <img
// // //               src={authorProfilePic || `https://ui-avatars.com/api/?name=${authorName.replace(/\s/g, "+")}&background=random`}
// // //               alt={authorName}
// // //               className="w-12 h-12 rounded-full object-cover"
// // //             />
// // //             <div>
// // //               <p className="font-semibold text-gray-900">{authorName}</p>
// // //               <div className="flex items-center space-x-2 text-sm text-gray-600">
// // //                 <Calendar className="w-4 h-4" />
// // //                 <span>{formatDateLong(post.created_at)}</span>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="flex items-center space-x-3">
// // //             <button
// // //               onClick={handleLike}
// // //               className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
// // //                 post.is_liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// // //               } ${!user ? 'cursor-not-allowed opacity-50' : ''}`}
// // //             >
// // //               <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
// // //               <span>{post.likes_count || 0}</span>
// // //             </button>

// // //             {user && user.id === post.author?.id && (
// // //               <Link
// // //                 to={`/edit/${post.id}`}
// // //                 className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
// // //               >
// // //                 <Edit className="w-4 h-4" />
// // //                 <span>Edit</span>
// // //               </Link>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {post.featured_image && (
// // //           <img
// // //             src={post.featured_image}
// // //             alt={post.title}
// // //             className="w-full h-auto max-h-[500px] object-cover rounded-lg my-8 shadow-md"
// // //           />
// // //         )}

// // //         {post.tags && post.tags.length > 0 && (
// // //           <div className="flex flex-wrap gap-2 mb-8">
// // //             {post.tags.map((tag, index) => (
// // //               <span
// // //                 key={index}
// // //                 className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-800 font-medium"
// // //               >
// // //                 <Tag className="w-3 h-3 mr-2" />
// // //                 {tag}
// // //               </span>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>

// // //       <div className="prose prose-lg max-w-none">
// // //         <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
// // //           {post.content}
// // //         </div>
// // //       </div>

// // //       <div className="mt-12 pt-8 border-t border-gray-200">
// // //         <Link
// // //           to="/"
// // //           className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
// // //         >
// // //           <ArrowLeft className="w-4 h-4 mr-2" />
// // //           Back to all posts
// // //         </Link>
// // //       </div>
// // //     </article>
// // //   );
// // // };

// // // export default PostDetailPage;

// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate, Link } from 'react-router-dom';
// // import { Heart, Edit, User, Calendar, Tag, ArrowLeft, MessageSquare } from 'lucide-react';
// // import { postsAPI } from '../api/posts';
// // import { useAuth } from '../hooks/useAuth';
// // import LoadingSpinner from '../components/common/LoadingSpinner';
// // import { formatDateLong, formatTimeAgo, getCloudinaryUrl} from '../utils/helpers';

// // const PostDetailPage = () => {
// //   const { id } = useParams();
// //   const [post, setPost] = useState(null);
// //   const [comments, setComments] = useState([]);
// //   const [newComment, setNewComment] = useState("");
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const { user } = useAuth();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     fetchPostAndComments();
// //   }, [id]);

// //   const fetchPostAndComments = async () => {
// //     try {
// //       setLoading(true);
// //       const [postData, commentsData] = await Promise.all([
// //         postsAPI.getPost(id),
// //         postsAPI.getCommentsForPost(id)
// //       ]);
// //       setPost(postData);
// //       setComments(commentsData);
// //     } catch (error) {
// //       console.error('Failed to fetch post or comments:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleLike = async () => {
// //     if (!user) {
// //       navigate('/login');
// //       return;
// //     }
// //     const originalPost = { ...post };
// //     setPost(currentPost => ({
// //       ...currentPost,
// //       is_liked: !currentPost.is_liked,
// //       likes_count: currentPost.is_liked ? currentPost.likes_count - 1 : currentPost.likes_count + 1
// //     }));
// //     try {
// //       await postsAPI.likePost(id);
// //     } catch (error) {
// //       console.error("Failed to like post, reverting UI:", error);
// //       setPost(originalPost);
// //       alert("Something went wrong, please try liking again.");
// //     }
// //   };

// //   const handleCommentSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!newComment.trim()) return;

// //     setIsSubmitting(true);
// //     try {
// //       await postsAPI.createComment(id, { content: newComment });
// //       setNewComment("");
// //       const commentsData = await postsAPI.getCommentsForPost(id);
// //       setComments(commentsData);
// //     } catch (error) {
// //       console.error("Failed to post comment:", error);
// //       alert("Could not post comment. Please try again.");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   if (loading) return <LoadingSpinner />;
// //   if (!post) {
// //     return (
// //       <div className="text-center py-20">
// //         <h1 className="text-2xl font-bold">Post not found</h1>
// //         <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
// //           Go back to Home
// //         </Link>
// //       </div>
// //     );
// //   }

// //   const authorName = post.author?.profile?.full_name || 'Anonymous';
// //   const authorProfilePic = post.author?.profile?.profile_picture;

// //   return (
// //     <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
// //       <header className="mb-8">
// //         {post.category && (
// //           <p className="text-base font-semibold text-blue-600 uppercase tracking-wide">
// //             {post.category}
// //           </p>
// //         )}
// //         <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
// //           {post.title}
// //         </h1>
// //         <div className="flex items-center space-x-4">
// //           <img
// //   src={
// //     authorProfilePic
// //       ? getCloudinaryUrl(authorProfilePic)
// //       : `https://ui-avatars.com/api/?name=${authorName.replace(/\s/g, "+")}&background=random`
// //   }
// //   alt={authorName}
// //   className="w-12 h-12 rounded-full object-cover"
// // />

// //           <div>
// //             <p className="font-semibold text-gray-800">{authorName}</p>
// //             <div className="flex items-center space-x-2 text-sm text-gray-500">
// //               <Calendar className="w-4 h-4" />
// //               <span>{formatDateLong(post.created_at)}</span>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       <div className="flex items-center space-x-3 border-y border-gray-200 py-3 mb-8">
// //         <button
// //           onClick={handleLike}
// //           className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
// //             post.is_liked ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //           } ${!user ? 'cursor-not-allowed opacity-60' : ''}`}
// //         >
// //           <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
// //           <span>{post.likes_count || 0} Likes</span>
// //         </button>
// //         {user && user.id === post.author?.id && (
// //           <Link
// //             to={`/edit/${post.id}`}
// //             className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
// //           >
// //             <Edit className="w-4 h-4" />
// //             <span>Edit</span>
// //           </Link>
// //         )}
// //       </div>

// //       {post.featured_image && (
// //   <img
// //     src={getCloudinaryUrl(post.featured_image)}
// //     alt={post.title}
// //     className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-8 shadow-lg"
// //   />
// // )}

// //       <div
// //         className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
// //         dangerouslySetInnerHTML={{ __html: post.content }}
// //       />

// //       {post.tags && post.tags.length > 0 && (
// //         <div className="mt-10 pt-6 border-t border-gray-200">
// //           <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Tags</h3>
// //           <div className="flex flex-wrap gap-3">
// //             {post.tags.map((tag) => (
// //               <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
// //                 <Tag className="w-4 h-4 mr-2 text-gray-500" />
// //                 {tag}
// //               </span>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       <div className="prose prose-lg max-w-none">
// //         <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">           {post.content}
// //         </div>
// //      </div>

// //       <div className="mt-12 pt-8 border-t border-gray-200">
// //         <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
// //           <MessageSquare className="w-6 h-6 mr-3" />
// //           Comments ({comments.length})
// //         </h2>
// //         {user ? (
// //           <form onSubmit={handleCommentSubmit} className="mb-8">
// //             <textarea
// //               value={newComment}
// //               onChange={(e) => setNewComment(e.target.value)}
// //               placeholder="Write a comment..."
// //               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //               rows="3"
// //               required
// //             />
// //             <button
// //               type="submit"
// //               disabled={isSubmitting}
// //               className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
// //             >
// //               {isSubmitting ? "Posting..." : "Post Comment"}
// //             </button>
// //           </form>
// //         ) : (
// //           <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
// //             <p>Please <Link to="/login" className="text-blue-600 font-semibold">log in</Link> to post a comment.</p>
// //           </div>
// //         )}
// //         <div className="space-y-6">
// //           {comments.length > 0 ? (
// //             comments.map((comment) => (
// //               <div key={comment.id} className="flex space-x-4">
// //                 <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
// //                     <User className="w-5 h-5 text-gray-600" />
// //                 </div>
// //                 <div className="flex-grow">
// //                   <div className="flex items-center space-x-2">
// //                     <p className="font-semibold">{comment.user}</p>
// //                     <p className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</p>
// //                   </div>
// //                   <p className="text-gray-700 mt-1">{comment.content}</p>
// //                 </div>
// //               </div>
// //             ))
// //           ) : (
// //             <p className="text-gray-600">No comments yet. Be the first to comment!</p>
// //           )}
// //         </div>
// //       </div>

// //       <footer className="mt-12 pt-8 border-t border-gray-200">
// //         <Link
// //           to="/"
// //           className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 transition-colors"
// //         >
// //           <ArrowLeft className="w-4 h-4 mr-2" />
// //           Back to all posts
// //         </Link>
// //       </footer>
// //     </article>
// //   );
// // };

// // export default PostDetailPage;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   Heart,
//   Edit,
//   User,
//   Calendar,
//   Tag,
//   ArrowLeft,
//   MessageSquare,
//   Trash2,
//   Share2,
//   Check,
// } from "lucide-react";
// import { postsAPI } from "../api/posts";
// import { useAuth } from "../hooks/useAuth";
// import LoadingSpinner from "../components/common/LoadingSpinner";
// import {
//   formatDateLong,
//   formatTimeAgo,
//   getCloudinaryUrl,
// } from "../utils/helpers";

// const PostDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [post, setPost] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [newComment, setNewComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     fetchPostAndComments();
//   }, [id]);

//   const fetchPostAndComments = async () => {
//     try {
//       setLoading(true);
//       const [postData, commentsData] = await Promise.all([
//         postsAPI.getPost(id),
//         postsAPI.getCommentsForPost(id),
//       ]);
//       setPost(postData);
//       setComments(commentsData);
//     } catch (error) {
//       console.error("Failed to fetch post or comments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLike = async () => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     const originalPost = { ...post };
//     setPost((current) => ({
//       ...current,
//       is_liked: !current.is_liked,
//       likes_count: current.is_liked
//         ? current.likes_count - 1
//         : current.likes_count + 1,
//     }));
//     try {
//       await postsAPI.likePost(id);
//     } catch {
//       setPost(originalPost);
//       alert("Something went wrong, please try again.");
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;
//     setIsSubmitting(true);
//     try {
//       await postsAPI.createComment(id, { content: newComment });
//       setNewComment("");
//       const commentsData = await postsAPI.getCommentsForPost(id);
//       setComments(commentsData);
//     } catch (error) {
//       console.error("Failed to post comment:", error);
//       alert("Could not post comment. Try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCommentDelete = async (commentId) => {
//     if (!window.confirm("Delete this comment?")) return;
//     try {
//       await postsAPI.deleteComment(commentId);
//       setComments((curr) => curr.filter((c) => c.id !== commentId));
//     } catch (error) {
//       console.error("Failed to delete comment:", error);
//       alert("Could not delete comment.");
//     }
//   };

//   // --- Share Handler ---
//   const handleShare = async () => {
//     const shareData = {
//       title: post.title,
//       text: `Check out this post: ${post.title}`,
//       url: window.location.href,
//     };
//     if (navigator.share) {
//       try {
//         await navigator.share(shareData);
//       } catch {}
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (!post)
//     return (
//       <div className="text-center py-20">
//         <h1 className="text-2xl font-bold">Post not found</h1>
//         <Link
//           to="/"
//           className="text-blue-600 hover:underline mt-4 inline-block"
//         >
//           Go back to Home
//         </Link>
//       </div>
//     );

//   const authorName = post.author?.profile?.full_name || "Anonymous";
//   const authorProfilePic = getCloudinaryUrl(
//     post.author?.profile?.profile_picture
//   );

//   return (
//     <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <header className="mb-8">
//         {post.category && (
//           <p className="text-base font-semibold text-blue-600 uppercase tracking-wide">
//             {post.category}
//           </p>
//         )}
//         <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
//           {post.title}
//         </h1>
//         <div className="flex items-center space-x-4">
//           {authorProfilePic && (
//             <img
//               src={getCloudinaryUrl(authorProfilePic)}
//               alt={authorName}
//               className="w-12 h-12 rounded-full object-cover"
//             />
//           )}

//           <div>
//             <p className="font-semibold text-gray-800">{authorName}</p>
//             <div className="flex items-center space-x-2 text-sm text-gray-500">
//               <Calendar className="w-4 h-4" />
//               <span>{formatDateLong(post.created_at)}</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="flex items-center space-x-3 border-y border-gray-200 py-3 mb-8">
//         <button
//           onClick={handleLike}
//           className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//             post.is_liked
//               ? "bg-red-100 text-red-700"
//               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//           } ${!user ? "cursor-not-allowed opacity-60" : ""}`}
//         >
//           <Heart className={`w-5 h-5 ${post.is_liked ? "fill-current" : ""}`} />
//           <span>{post.likes_count || 0} Likes</span>
//         </button>
//         {user && user.id === post.author?.id && (
//           <Link
//             to={`/edit/${post.id}`}
//             className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
//           >
//             <Edit className="w-4 h-4" />
//             <span>Edit</span>
//           </Link>
//         )}
//         <button
//           onClick={handleShare}
//           className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//         >
//           {copied ? (
//             <Check className="w-4 h-4 text-green-600" />
//           ) : (
//             <Share2 className="w-4 h-4" />
//           )}
//           <span>{copied ? "Copied!" : "Share"}</span>
//         </button>
//       </div>

//       {post.featured_image && getCloudinaryUrl(post.featured_image) && (
//         <img
//           src={getCloudinaryUrl(post.featured_image)}
//           alt={post.title}
//           loading="lazy"
//           className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-8 shadow-lg"
//         />
//       )}
//       <div
//         className="
//     w-full max-w-4xl mx-auto my-8
//     prose prose-slate dark:prose-invert
//     prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
//     prose-p:mb-4 prose-p:text-gray-700 dark:prose-p:text-gray-200
//     prose-ul:list-disc prose-ol:list-decimal prose-li:ml-6
//     prose-a:text-blue-600 hover:prose-a:text-blue-800
//     break-words
//   "
//         dangerouslySetInnerHTML={{ __html: post.content }}
//       />

//       {post.tags?.length > 0 && (
//         <div className="mt-10 pt-6 border-t border-gray-200">
//           <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
//             Tags
//           </h3>
//           <div className="flex flex-wrap gap-3">
//             {post.tags.map((tag) => (
//               <span
//                 key={tag}
//                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
//               >
//                 <Tag className="w-4 h-4 mr-2 text-gray-500" />
//                 {tag}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Comments Section */}
//       <div className="mt-12 pt-8 border-t border-gray-200">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
//           <MessageSquare className="w-6 h-6 mr-3" />
//           Comments ({comments.length})
//         </h2>

//         {user ? (
//           <form onSubmit={handleCommentSubmit} className="mb-8">
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder="Write a comment..."
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               rows="3"
//               required
//             />
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             >
//               {isSubmitting ? "Posting..." : "Post Comment"}
//             </button>
//           </form>
//         ) : (
//           <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
//             <p>
//               Please{" "}
//               <Link to="/login" className="text-blue-600 font-semibold">
//                 log in
//               </Link>{" "}
//               to post a comment.
//             </p>
//           </div>
//         )}

//         <div className="space-y-6">
//           {comments.length > 0 ? (
//             comments.map((comment) => {
//               const loggedInUserId = user?.id;
//               const isCommentAuthor = loggedInUserId === comment.user_id;
//               const isPostAuthor = loggedInUserId === post.author?.id;
//               const showDelete = user && (isCommentAuthor || isPostAuthor);

//               return (
//                 <div key={comment.id} className="flex space-x-4">
//                   <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
//                     <User className="w-5 h-5 text-gray-600" />
//                   </div>
//                   <div className="flex-grow">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-semibold">{comment.user_name}</p>
//                         <p className="text-xs text-gray-500">
//                           {formatTimeAgo(comment.created_at)}
//                         </p>
//                       </div>
//                       {showDelete && (
//                         <button
//                           onClick={() => handleCommentDelete(comment.id)}
//                           title="Delete comment"
//                           className="text-gray-400 hover:text-red-600 transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>
//                     <p className="text-gray-700 mt-1 whitespace-pre-wrap">
//                       {comment.content}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p className="text-gray-600">
//               No comments yet. Be the first to comment!
//             </p>
//           )}
//         </div>
//       </div>

//       <footer className="mt-12 pt-8 border-t border-gray-200">
//         <Link
//           to="/"
//           className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to all posts
//         </Link>
//       </footer>
//     </article>
//   );
// };

// export default PostDetailPage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart,
  Edit,
  User,
  Calendar,
  Tag,
  ArrowLeft,
  MessageSquare,
  Trash2,
  Share2,
  Check,
} from "lucide-react";
import { postsAPI } from "../api/posts";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  formatDateLong,
  formatTimeAgo,
  getCloudinaryUrl,
} from "../utils/helpers";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Image loading states
  const [imageError, setImageError] = useState(false);
  const [authorImageError, setAuthorImageError] = useState(false);

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        postsAPI.getPost(id),
        postsAPI.getCommentsForPost(id),
      ]);
      setPost(postData);
      setComments(commentsData);
      
      // Reset image error states when new post loads
      setImageError(false);
      setAuthorImageError(false);
    } catch (error) {
      console.error("Failed to fetch post or comments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced image URL helper
  const getImageUrl = (imageValue) => {
    if (!imageValue) return null;
    
    // If it's already a full URL, return as-is
    if (typeof imageValue === 'string' && imageValue.startsWith('http')) {
      return imageValue;
    }
    
    // Try using the helper function
    const cloudinaryUrl = getCloudinaryUrl(imageValue);
    if (cloudinaryUrl && cloudinaryUrl !== imageValue) {
      return cloudinaryUrl;
    }
    
    // If helper didn't work and we have a string, try constructing Cloudinary URL
    if (typeof imageValue === 'string' && imageValue.length > 0) {
      const cloudName = import.meta.env.VITE_CLOUD_NAME || 'dmruk1niu'; // fallback
      return `https://res.cloudinary.com/${cloudName}/image/upload/${imageValue}`;
    }
    
    return null;
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const originalPost = { ...post };
    setPost((current) => ({
      ...current,
      is_liked: !current.is_liked,
      likes_count: current.is_liked
        ? current.likes_count - 1
        : current.likes_count + 1,
    }));
    try {
      await postsAPI.likePost(id);
    } catch {
      setPost(originalPost);
      alert("Something went wrong, please try again.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await postsAPI.createComment(id, { content: newComment });
      setNewComment("");
      const commentsData = await postsAPI.getCommentsForPost(id);
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Could not post comment. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await postsAPI.deleteComment(commentId);
      setComments((curr) => curr.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Could not delete comment.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `Check out this post: ${post.title}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!post)
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link
          to="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Go back to Home
        </Link>
      </div>
    );

  const authorName = post.author?.profile?.full_name || post.author?.full_name || "Anonymous";
  const authorProfilePicUrl = getImageUrl(post.author?.profile?.profile_picture);
  const featuredImageUrl = getImageUrl(post.featured_image);

  // Debug logging (remove in production)
  // console.log('Post data:', {
  //   featured_image: post.featured_image,
  //   featuredImageUrl,
  //   authorProfilePic: post.author?.profile?.profile_picture,
  //   authorProfilePicUrl
  // });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        {post.category && (
          <p className="text-base font-semibold text-blue-600 uppercase tracking-wide">
            {post.category}
          </p>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center space-x-4">
          {/* Author Profile Picture with Error Handling */}
          {authorProfilePicUrl && !authorImageError ? (
            <img
              src={authorProfilePicUrl}
              alt={authorName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              // onError={() => {
              //   console.error('Author image failed to load:', authorProfilePicUrl);
              //   setAuthorImageError(true);
              // }}
              // onLoad={() => console.log('Author image loaded successfully')}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-800">{authorName}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDateLong(post.created_at)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center space-x-3 border-y border-gray-200 py-3 mb-8">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            post.is_liked
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } ${!user ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <Heart className={`w-5 h-5 ${post.is_liked ? "fill-current" : ""}`} />
          <span>{post.likes_count || 0} Likes</span>
        </button>
        {user && user.id === post.author?.id && (
          <Link
            to={`/edit/${post.id}`}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>
        )}
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          <span>{copied ? "Copied!" : "Share"}</span>
        </button>
      </div>

      {/* Featured Image with Enhanced Error Handling */}
      {featuredImageUrl && !imageError && (
        <div className="mb-8">
          <img
            src={featuredImageUrl}
            alt={post.title}
            loading="lazy"
            className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg"
            // onError={(e) => {
            //   // console.error('Featured image failed to load:', featuredImageUrl);
            //   // console.error('Error details:', e);
            //   setImageError(true);
            // }}
            // onLoad={() => console.log('Featured image loaded successfully:', featuredImageUrl)}
          />
        </div>
      )}

      {/* Debug info (remove in production)
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
          <p><strong>Original featured_image:</strong> {JSON.stringify(post.featured_image)}</p>
          <p><strong>Processed URL:</strong> {featuredImageUrl || 'null'}</p>
          <p><strong>Image Error:</strong> {imageError.toString()}</p>
          <p><strong>VITE_CLOUD_NAME:</strong> {import.meta.env.VITE_CLOUD_NAME || 'not set'}</p>
        </div>
      )} */}

      {/* Post Content */}
      <div
        className="
          w-full max-w-4xl mx-auto my-8
          prose prose-slate dark:prose-invert
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-p:mb-4 prose-p:text-gray-700 dark:prose-p:text-gray-200
          prose-ul:list-disc prose-ol:list-decimal prose-li:ml-6
          prose-a:text-blue-600 hover:prose-a:text-blue-800
          break-words
        "
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags Section */}
      {post.tags?.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
            Tags
          </h3>
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                <Tag className="w-4 h-4 mr-2 text-gray-500" />
                {typeof tag === 'object' ? tag.name : tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <MessageSquare className="w-6 h-6 mr-3" />
          Comments ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
            <p>
              Please{" "}
              <Link to="/login" className="text-blue-600 font-semibold">
                log in
              </Link>{" "}
              to post a comment.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => {
              const loggedInUserId = user?.id;
              const isCommentAuthor = loggedInUserId === comment.user_id;
              const isPostAuthor = loggedInUserId === post.author?.id;
              const showDelete = user && (isCommentAuthor || isPostAuthor);

              return (
                <div key={comment.id} className="flex space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{comment.user_name}</p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(comment.created_at)}
                        </p>
                      </div>
                      {showDelete && (
                        <button
                          onClick={() => handleCommentDelete(comment.id)}
                          title="Delete comment"
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <Link
          to="/"
          className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all posts
        </Link>
      </footer>
    </article>
  );
};

export default PostDetailPage;