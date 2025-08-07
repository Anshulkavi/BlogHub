import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute'; // Your updated component
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import LikedPostsPage from './pages/LikedPostsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              {/* === Public Routes === */}
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* === Protected Routes Grouped Together === */}
              <Route element={<ProtectedRoute />}>
                <Route path="/write" element={<CreatePostPage />} />
                <Route path="/edit/:id" element={<EditPostPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/liked-posts" element={<LikedPostsPage />} />

                {/* You can add any other protected routes here */}
              </Route>

              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;