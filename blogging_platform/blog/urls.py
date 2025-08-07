from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, ProfileView, PostListCreateView, PostDetailView,
    CommentListCreateView, CommentDeleteView, LikeToggleView,
    CategoryDetailView, CategoryListCreateView, LoginView,
    UserPostListView, CategoryPostListView, TagListView, LikedPostsListView
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),  # your custom login (email-based)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile
    path('profile/', ProfileView.as_view(), name='profile'),    

    # Posts
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('users/<int:user_id>/posts/', UserPostListView.as_view(), name='user-posts-list'),
    path('posts/<int:post_id>/like/', LikeToggleView.as_view(), name='like-toggle'),
    path('posts/liked/', LikedPostsListView.as_view(), name='liked-posts-list'),

    # Comments
    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/delete/', CommentDeleteView.as_view(), name='comment-delete'),

    # Categories
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('categories/<slug:category_slug>/posts/', CategoryPostListView.as_view(), name='category-posts'),

    # Tags
    path('tags/', TagListView.as_view(), name='tag-list'),
]
