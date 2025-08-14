import api from "./config";

export const postsAPI = {
  getPosts: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/posts/?${queryParams}`);
    return response.data;
  },

  getPost: async (id) => {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  },

  createPost: async (postData) => {
    // ✅ Add postData here
    const isFormData = postData instanceof FormData;
    const response = await api.post("/posts/", postData, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return response.data;
  },

  getPostsByUser: async (userId) => {
    // This calls the new endpoint we just created in Django
    const response = await api.get(`/users/${userId}/posts/`);
    return response.data;
  },

updatePost: async (id, postData, token) => {
  const isFormData = postData instanceof FormData;

  const response = await api.patch(`/posts/${id}/`, postData, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ add this
      ...(isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" }),
    },
  });

  return response.data;
},


  deletePost: async (id) => {
    await api.delete(`/posts/${id}/`);
  },

  likePost: async (id) => {
    const response = await api.post(`/posts/${id}/like/`);
    return response.data;
  },

  getLikedPosts: async () => {
    const response = await api.get("/posts/liked/");
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/categories/");
    return response.data;
  },

  getPostsByCategorySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}/posts/`);
    return response.data;
  },

  getTags: async () => {
    const response = await api.get("/tags/");
    return response.data;
  },

  getCommentsForPost: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments/`);
    return response.data;
  },

  createComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments/`, commentData);
    return response.data;
  },

};

