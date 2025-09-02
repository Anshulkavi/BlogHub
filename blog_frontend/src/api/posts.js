// import api from "./config";

// export const postsAPI = {

//   // getPosts: async (params = {}) => {
//   //   const queryParams = new URLSearchParams(params);
//   //   const response = await api.get(`/posts/?${queryParams}`);
//   //   return response.data;
//   // },

//   getPosts: async (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   const response = await api.get(`/posts/?${queryParams}`);
//   const data = response.data;

//   return Array.isArray(data)
//     ? data
//     : (data?.results && Array.isArray(data.results) ? data.results : []);
// },


//   getPost: async (id) => {
//     const response = await api.get(`/posts/${id}/`);
//     return response.data;
//   },

//   // createPost: async (postData) => {
//   //   // ✅ Add postData here
//   //   const isFormData = postData instanceof FormData;
//   //   const response = await api.post("/posts/", postData, {
//   //     headers: {
//   //       "Content-Type": isFormData ? "multipart/form-data" : "application/json",
//   //     },
//   //   });
//   //   return response.data;
//   // },

//   createPost: async (postData) => {
//   const isFormData = postData instanceof FormData;
//   const headers = {
//     "Content-Type": isFormData ? "multipart/form-data" : "application/json",
//   };
//   const response = await api.post("/posts/", postData, { headers });
//   return response.data;
// },

// // ✅ FIXED VERSION
// updatePost: async (id, postData) => {
//   // We no longer need the 'token' parameter. The interceptor handles it.
//   const isFormData = postData instanceof FormData;
//   const headers = {
//     // Let the interceptor add the Authorization header automatically.
//     // We only need to set the Content-Type.
//     "Content-Type": isFormData ? "multipart/form-data" : "application/json",
//   };
//   const response = await api.patch(`/posts/${id}/`, postData, { headers });
//   return response.data;
// },

//   // getPostsByUser: async (userId) => {
//   //   // This calls the new endpoint we just created in Django
//   //   const response = await api.get(`/users/${userId}/posts/`);
//   //   return response.data;
//   // },

// // updatePost: async (id, postData, token) => {
// //   const isFormData = postData instanceof FormData;

// //   const response = await api.patch(`/posts/${id}/`, postData, {
// //     headers: {
// //       Authorization: `Bearer ${token}`, // ✅ add this
// //       ...(isFormData
// //         ? { "Content-Type": "multipart/form-data" }
// //         : { "Content-Type": "application/json" }),
// //     },
// //   });

// //   return response.data;
// // },


//   deletePost: async (id) => {
//     await api.delete(`/posts/${id}/`);
//   },

//   likePost: async (id) => {
//     const response = await api.post(`/posts/${id}/like/`);
//     return response.data;
//   },

//   // getLikedPosts: async () => {
//   //   const response = await api.get("/posts/liked/");
//   //   return response.data;
//   // },

//   // getCategories: async () => {
//   //   const response = await api.get("/categories/");
//   //   return response.data;
//   // },
//   getCategories: async () => {
//   const response = await api.get("/categories/");
//   const data = response.data;

//   return Array.isArray(data)
//     ? data
//     : (data?.results && Array.isArray(data.results) ? data.results : []);
// },


//   // getPostsByCategorySlug: async (slug) => {
//   //   const response = await api.get(`/categories/${slug}/posts/`);
//   //   return response.data;
//   // },

//   // getTags: async () => {
//   //   const response = await api.get("/tags/");
//   //   return response.data;
//   // },

//   getTags: async () => {
//   const response = await api.get("/tags/");
//   const data = response.data;

//   // normalize once here
//   return Array.isArray(data)
//     ? data
//     : (data?.results && Array.isArray(data.results) ? data.results : []);
// },


//   // getCommentsForPost: async (postId) => {
//   //   const response = await api.get(`/posts/${postId}/comments/`);
//   //   return response.data;
//   // },

//   getCommentsForPost: async (postId) => {
//   const response = await api.get(`/posts/${postId}/comments/`);
//   // Agar paginated response mila (results key hai) to results return karo
//   // warna directly data (array) return kar do
//   return response.data.results || response.data;
// },


//   createComment: async (postId, commentData) => {
//     const response = await api.post(`/posts/${postId}/comments/`, commentData);
//     return response.data;
//   },

  
//   deleteComment: async (commentId) => {
//     const { data } = await api.delete(`/comments/${commentId}/delete/`);
//     return data;
//   },

//   getPostsByUser: async (userId) => {
//   const response = await api.get(`/users/${userId}/posts/`);
//   const data = response.data;
//   return Array.isArray(data)
//     ? data
//     : (data?.results && Array.isArray(data.results) ? data.results : []);
// },

// getPostsByCategorySlug: async (slug) => {
//   const response = await api.get(`/categories/${slug}/posts/`);
//   const data = response.data;
//   return Array.isArray(data)
//     ? data
//     : (data?.results && Array.isArray(data.results) ? data.results : []);
// },

// getLikedPosts: async () => {
//   const response = await api.get("/posts/liked/");
//   const data = response.data;
//   return Array.isArray(data)
//     ? data
//     : (data?.results && Array.isArray(data.results) ? data.results : []);
// },


// };


import api from "./config";

export const postsAPI = {
  // ✅ Get all posts (handles pagination + array)
  getPosts: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/posts/?${queryParams}`);
    const data = response.data;

    return Array.isArray(data)
      ? data
      : (data?.results && Array.isArray(data.results) ? data.results : []);
  },

  // ✅ Get single post by ID
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  },

  // ✅ Create post (handles JSON + FormData)
  createPost: async (postData) => {
    const isFormData = postData instanceof FormData;
    const headers = {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    };
    const response = await api.post("/posts/", postData, { headers });
    return response.data;
  },

  // ✅ Update post (PATCH)
  updatePost: async (id, postData) => {
    const isFormData = postData instanceof FormData;
    const headers = {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    };
    const response = await api.patch(`/posts/${id}/`, postData, { headers });
    return response.data;
  },

  // ✅ Delete post
  deletePost: async (id) => {
    await api.delete(`/posts/${id}/`);
  },

  // ✅ Like post
  likePost: async (id) => {
    const response = await api.post(`/posts/${id}/like/`);
    return response.data;
  },

  // ✅ Get categories (normalize array + pagination)
  getCategories: async () => {
    const response = await api.get("/categories/");
    const data = response.data;

    return Array.isArray(data)
      ? data
      : (data?.results && Array.isArray(data.results) ? data.results : []);
  },

  // ✅ Get tags (normalize array + pagination)
  getTags: async () => {
    const response = await api.get("/tags/");
    const data = response.data;

    return Array.isArray(data)
      ? data
      : (data?.results && Array.isArray(data.results) ? data.results : []);
  },

  // ✅ Get comments for a post (normalize)
  getCommentsForPost: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments/`);
    const data = response.data;

    return Array.isArray(data)
      ? data
      : (data?.results && Array.isArray(data.results) ? data.results : []);
  },

  // ✅ Create comment
  createComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments/`, commentData);
    return response.data;
  },

  // ✅ Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}/delete/`);
    return response.data;
  },

  // ✅ Get posts by user
  getPostsByUser: async (userId) => {
    const response = await api.get(`/users/${userId}/posts/`);
    const data = response.data;

    return Array.isArray(data)
      ? data
      : (data?.results && Array.isArray(data.results) ? data.results : []);
  },

  // ✅ Get posts by category slug
  getPostsByCategorySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}/posts/`);
    const data = response.data;

    return Array.isArray(data)
      ? data
      : (data?.results && Array.isArray(data.results) ? data.results : []);
  },

  // ✅ Get liked posts
  getLikedPosts: async () => {
    const response = await api.get("/posts/liked/");
    const data = response.data;

    return Array.isArray(data)
      ? data
      : (data?.results && Array.isArray(data.results) ? data.results : []);
  },
};
