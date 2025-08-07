// import React, { useState, useEffect } from 'react';
// import { postsAPI } from '../api/posts';
// import { useAuth } from '../hooks/useAuth';
// import PostCard from '../components/common/PostCard';
// import PostFilters from '../components/posts/PostFilters';
// import LoadingSpinner from '../components/common/LoadingSpinner';
// import { useNavigate } from 'react-router-dom';

// const HomePage = () => {
//   const [posts, setPosts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedTag, setSelectedTag] = useState('');

//   // ✅ Step 1: Nayi state category filter ke liye
//   const [selectedCategory, setSelectedCategory] = useState('');

//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // 🔄 Step 2: useEffect ko update kiya gaya taaki category change par bhi posts fetch ho
//   useEffect(() => {
//     fetchPosts();
//   }, [searchTerm, selectedTag, selectedCategory]); // selectedCategory ko add kiya

//   // Yeh effect categories ko ek baar fetch karega
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);

//       // 🔄 Step 3: API call ke params ko update kiya gaya
//       const params = {
//         ...(searchTerm && { search: searchTerm }),
//         ...(selectedTag && { tags__name: selectedTag }),
//         ...(selectedCategory && { category__name: selectedCategory }) // Category filter add kiya
//       };

//       const data = await postsAPI.getPosts(params);
//       setPosts(data.results || data);
//     } catch (error) {
//       console.error('Failed to fetch posts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const data = await postsAPI.getCategories();
//       setCategories(data);
//     } catch (error) {
//       console.error('Failed to fetch categories:', error);
//     }
//   };

//   // Like handler (no change)
//   const handleLike = async (postId) => {
//  if (!user) {
//       navigate('/login'); // Redirect to login
//       return;
//     }    try {
//       await postsAPI.likePost(postId);
//       fetchPosts();
//     } catch (error) {
//       console.error('Failed to like post:', error);
//     }
//   };

//   // Tag click handler (no change)
//   const handleTagClick = (tagName) => {
//     setSelectedTag(tagName);
//     setSelectedCategory(''); // Category filter clear kar dein jab tag select ho
//   };

//   // ✅ Step 4: Category select/deselect ke liye naya function
//   const handleCategoryClick = (categoryName) => {
//     // Agar pehle se selected category par dobara click kiya, toh filter hata do
//     if (selectedCategory === categoryName) {
//       setSelectedCategory('');
//     } else {
//       setSelectedCategory(categoryName);
//       setSelectedTag(''); // Tag filter clear kar dein jab category select ho
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <PostFilters
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         selectedTag={selectedTag}
//         setSelectedTag={setSelectedTag}
//       />

//       <div className="mb-8">
//         <h3 className="text-lg font-semibold mb-3">Browse by Category</h3>
//         <div className="flex flex-wrap gap-2">
//           {categories.map((category) => (
//             // 🔄 Step 5: <Link> ko <button> se replace kiya gaya hai
//             <button
//               key={category.id}
//               onClick={() => handleCategoryClick(category.name)}
//               // 🎨 Step 6: Conditional styling se active category highlight hogi
//               className={`px-3 py-1 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium ${
//                 selectedCategory === category.name
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-gray-100 text-gray-800'
//               }`}
//             >
//               {category.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {posts.map((post) => (
//             <PostCard
//               key={post.id}
//               post={post}
//               onLike={handleLike}
//               onTagClick={handleTagClick}
//               user={user}
//             />
//           ))}
//         </div>
//       )}

//       {posts.length === 0 && !loading && (
//         <div className="text-center py-12">
//           <p className="text-gray-600 text-lg">No posts found.</p>
//           <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from hereimport { postsAPI } from "../api/posts";
import { useAuth } from "../hooks/useAuth";
import PostCard from "../components/common/PostCard";
import PostFilters from "../components/posts/PostFilters";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { postsAPI } from "../api/posts";
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const navigate = useNavigate();

  // Empty string '' ka matlab hai "All categories"
  const [selectedCategory, setSelectedCategory] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, selectedTag, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(selectedTag && { tags__name: selectedTag }),
        ...(selectedCategory && { category__name: selectedCategory }),
      };

      const data = await postsAPI.getPosts(params);
      setPosts(data.results || data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await postsAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Store the original list of posts in case the API call fails
    const originalPosts = [...posts];

    // Step 1: Find the post and INSTANTLY update the UI
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        // Flip the 'is_liked' status and update the count
        return {
          ...post,
          is_liked: !post.is_liked,
          likes_count: post.is_liked
            ? post.likes_count - 1
            : post.likes_count + 1,
        };
      }
      return post;
    });
    setPosts(updatedPosts);

    // Step 2: Send the request to the server in the background
    try {
      // We don't call fetchPosts() anymore!
      await postsAPI.likePost(postId);
    } catch (error) {
      console.error("Failed to like post, reverting UI:", error);
      // If the API call fails, revert the UI back to its original state
      setPosts(originalPosts);
      alert("Something went wrong, please try liking again.");
    }
  };

  const handleTagClick = (tagName) => {
    setSelectedTag(tagName);
    setSelectedCategory("");
  };

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(categoryName);
      setSelectedTag("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PostFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />

      {/* 👇 YAHAN CHANGES KIYE GAYE HAIN 👇 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Browse by Category</h3>
        <div className="flex flex-wrap gap-2">
          {/* Step 1: "All" ka button add karein */}
          <button
            onClick={() => handleCategoryClick("")}
            className={`px-3 py-1 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium ${
              selectedCategory === ""
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            All
          </button>

          {/* Step 2: Baaki categories pehle ki tarah map hongi */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`px-3 py-1 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium ${
                selectedCategory === category.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      {/* 🛑 CHANGES END HERE 🛑 */}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onTagClick={handleTagClick}
              user={user}
            />
          ))}
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No posts found.</p>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
