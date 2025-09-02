// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate from hereimport { postsAPI } from "../api/posts";
// import { useAuth } from "../hooks/useAuth";
// import PostCard from "../components/common/PostCard";
// import PostFilters from "../components/posts/PostFilters";
// import LoadingSpinner from "../components/common/LoadingSpinner";
// import { postsAPI } from "../api/posts";
// const HomePage = () => {
//   const [posts, setPosts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const navigate = useNavigate();

//   // Empty string '' ka matlab hai "All categories"
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const { user } = useAuth();

//   useEffect(() => {
//     fetchPosts();
//   }, [searchTerm, selectedTag, selectedCategory]);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         ...(searchTerm && { search: searchTerm }),
//         ...(selectedTag && { tags__name: selectedTag }),
//         ...(selectedCategory && { category__name: selectedCategory }),
//       };

//       const data = await postsAPI.getPosts(params);
//       setPosts(data.results || data);
//     } catch (error) {
//       console.error("Failed to fetch posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const data = await postsAPI.getCategories();
//       setCategories(data);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   const handleLike = async (postId) => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     // Store the original list of posts in case the API call fails
//     const originalPosts = [...posts];

//     // Step 1: Find the post and INSTANTLY update the UI
//     const updatedPosts = posts.map((post) => {
//       if (post.id === postId) {
//         // Flip the 'is_liked' status and update the count
//         return {
//           ...post,
//           is_liked: !post.is_liked,
//           likes_count: post.is_liked
//             ? post.likes_count - 1
//             : post.likes_count + 1,
//         };
//       }
//       return post;
//     });
//     setPosts(updatedPosts);

//     // Step 2: Send the request to the server in the background
//     try {
//       // We don't call fetchPosts() anymore!
//       await postsAPI.likePost(postId);
//     } catch (error) {
//       console.error("Failed to like post, reverting UI:", error);
//       // If the API call fails, revert the UI back to its original state
//       setPosts(originalPosts);
//       alert("Something went wrong, please try liking again.");
//     }
//   };

//   const handleTagClick = (tagName) => {
//     setSelectedTag(tagName);
//     setSelectedCategory("");
//   };

//   const handleCategoryClick = (categoryName) => {
//     if (selectedCategory === categoryName) {
//       setSelectedCategory("");
//     } else {
//       setSelectedCategory(categoryName);
//       setSelectedTag("");
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

//       {/* 👇 YAHAN CHANGES KIYE GAYE HAIN 👇 */}
//       <div className="mb-8">
//         <h3 className="text-lg font-semibold mb-3">Browse by Category</h3>
//         <div className="flex flex-wrap gap-2">
//           {/* Step 1: "All" ka button add karein */}
//           <button
//             onClick={() => handleCategoryClick("")}
//             className={`px-3 py-1 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium ${
//               selectedCategory === ""
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-100 text-gray-800"
//             }`}
//           >
//             All
//           </button>

//           {/* Step 2: Baaki categories pehle ki tarah map hongi */}
//           {categories.map((category) => (
//             <button
//               key={category.id}
//               onClick={() => handleCategoryClick(category.name)}
//               className={`px-3 py-1 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium ${
//                 selectedCategory === category.name
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-100 text-gray-800"
//               }`}
//             >
//               {category.name}
//             </button>
//           ))}
//         </div>
//       </div>
//       {/* 🛑 CHANGES END HERE 🛑 */}

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
//           <p className="text-sm text-gray-500">
//             Try adjusting your search or filters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;

// // src/pages/HomePage.js
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import PostCard from "../components/common/PostCard";
// import PostFilters from "../components/posts/PostFilters";
// import LoadingSpinner from "../components/common/LoadingSpinner";
// import { postsAPI } from "../api/posts";

// const HomePage = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   // --- Filter and Sort State ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const [sortBy, setSortBy] = useState("latest"); // Added for sorting
//   const [dateFilter, setDateFilter] = useState("");   // Added for date filtering
//   const [selectedCategory, setSelectedCategory] = useState(""); // 1. ADD STATE FOR CATEGORY

  
//   // --- Data for Filters ---
//   const [popularTags, setPopularTags] = useState([]); // For the tag dropdown
//   const [categories, setCategories] = useState([]); // 2. ADD STATE TO HOLD CATEGORIES

//   // Fetch posts whenever a filter or sort option changes
//   useEffect(() => {
//     fetchPosts();
//   }, [searchTerm, selectedTag, sortBy, dateFilter]);

//  // Update dependency array to include the new category filter
//   useEffect(() => {
//     fetchPosts();
//   }, [searchTerm, selectedTag, sortBy, dateFilter, selectedCategory]);

//   useEffect(() => {
//     fetchTags();
//     fetchCategories(); // 3. FETCH CATEGORIES ON MOUNT
//   }, []);


//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         ...(searchTerm && { search: searchTerm }),
//         ...(selectedTag && { tags__name: selectedTag }),
//         ...(selectedCategory && { category__name: selectedCategory }), // 4. ADD CATEGORY TO API PARAMS
//         ...(sortBy && { ordering: sortBy }),
//         ...(dateFilter && { published: dateFilter }),
//       };

//       const data = await postsAPI.getPosts(params);
//       setPosts(data.results || data || []);
//     } catch (error) {
//       console.error("Failed to fetch posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // New function to fetch tags for the filter dropdown
//   const fetchTags = async () => {
//     try {
//       const tagsData = await postsAPI.getTags();
//       // Assuming tagsData is an array of objects like [{ name: 'react' }, ...]
//       setPopularTags(tagsData.map(tag => tag.name));
//     } catch (error)      {
//       console.error("Failed to fetch tags:", error);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const categoriesData = await postsAPI.getCategories();
//       setCategories(categoriesData || []);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   const handleLike = async (postId) => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     const originalPosts = [...posts];
//     const updatedPosts = posts.map((post) => {
//       if (post.id === postId) {
//         return {
//           ...post,
//           is_liked: !post.is_liked,
//           likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
//         };
//       }
//       return post;
//     });
//     setPosts(updatedPosts);
//     try {
//       await postsAPI.likePost(postId);
//     } catch (error) {
//       console.error("Failed to like post, reverting UI:", error);
//       setPosts(originalPosts);
//       alert("Something went wrong, please try liking again.");
//     }
//   };

//   // This function is now passed to the PostCard to set the tag filter
//   const handleTagClick = (tagName) => {
//     setSelectedTag(tagName);
//   };
  
//   // New function to clear all active filters
//   const handleClearAll = () => {
//     setSearchTerm('');
//     setSelectedTag('');
//     setSortBy('latest');
//     setDateFilter('');
//     setSelectedCategory(''); // 6. RESET CATEGORY ON CLEAR
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <PostFilters
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         selectedTag={selectedTag}
//         setSelectedTag={setSelectedTag}
//         sortBy={sortBy}
//         setSortBy={setSortBy}
//         dateFilter={dateFilter}
//         setDateFilter={setDateFilter}
//         selectedCategory={selectedCategory}     // 7. PASS NEW PROPS
//         setSelectedCategory={setSelectedCategory} // 7. PASS NEW PROPS
//         categories={categories}                 // 7. PASS NEW PROPS
//         onClearAll={handleClearAll}
//         isLoading={loading}
//         totalResults={posts.length}
//         popularTags={popularTags}
//         // recentSearches={recentSearches} // You can implement this later if needed
//         onSearch={fetchPosts}
//       />
      
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
//         <div className="text-center py-12 md:col-span-3">
//           <h3 className="text-xl font-medium text-gray-700">No posts found</h3>
//           <p className="text-gray-500 mt-2">
//             Try adjusting your search or clearing the filters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;

// src/pages/HomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PostCard from "../components/common/PostCard";
import PostFilters from "../components/posts/PostFilters";
import PostCardSkeleton from "../components/common/PostCardSkeleton"; // Import the skeleton loader
import { postsAPI } from "../api/posts";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- Filter and Sort State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // --- Data for Filters ---
  const [popularTags, setPopularTags] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch posts whenever a filter or sort option changes
  useEffect(() => {
    fetchPosts();
  }, [searchTerm, selectedTag, sortBy, dateFilter, selectedCategory]);

  // Fetch tags and categories only once when the component mounts
  useEffect(() => {
    fetchTags();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(selectedTag && { tags__name: selectedTag }),
        ...(selectedCategory && { category__name: selectedCategory }),
        ...(sortBy && { ordering: sortBy }),
        ...(dateFilter && { published: dateFilter }),
      };

      const data = await postsAPI.getPosts(params);
      setPosts(data.results || data || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTags = async () => {
  try {
    const tagsData = await postsAPI.getTags();
setPopularTags(tagsData.map(tag => tag.name));

  } catch (error) {
    console.error("Failed to fetch tags:", error);
  }
};


  const fetchCategories = async () => {
    try {
      const categoriesData = await postsAPI.getCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const originalPosts = [...posts];
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          is_liked: !post.is_liked,
          likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    try {
      await postsAPI.likePost(postId);
    } catch (error) {
      console.error("Failed to like post, reverting UI:", error);
      setPosts(originalPosts);
      alert("Something went wrong, please try liking again.");
    }
  };

  const handleTagClick = (tagName) => {
    setSelectedTag(tagName);
  };
  
  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedTag('');
    setSortBy('latest');
    setDateFilter('');
    setSelectedCategory('');
  };

return (
  <div className="flex flex-col min-h-screen">
    {/* Page Content */}
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PostFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        sortBy={sortBy}
        setSortBy={setSortBy}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onClearAll={handleClearAll}
        isLoading={loading}
        totalResults={posts.length}
        popularTags={popularTags}
        onSearch={() => {}}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onTagClick={handleTagClick}
              user={user}
            />
          ))
        ) : (
          <div className="text-center py-12 md:col-span-3">
            <h3 className="text-xl font-medium text-gray-700">No posts found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or clearing the filters.
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-gray-100 text-center py-4 mt-8 border-t">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} SkillSwap. All rights reserved.
      </p>
    </footer>
  </div>
);

};

export default HomePage;