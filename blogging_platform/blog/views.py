from django.shortcuts import render
from django.contrib.auth import authenticate,get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser, AllowAny
from rest_framework import status, generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import (RegisterSerializer, ProfileSerializer, 
                          PostSerializer, CommentSerializer,
                          LikeSerializer, CategorySerializer, TagSerializer)
from .models import Category,Post,Comment,Like,Tag
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    """
    Handles user registration and immediately returns JWT tokens for auto-login.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # serializer.save() creates the user
            user = serializer.save()
            
            # Generate JWT tokens for the newly created user
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "User registered successfully",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny] # ✅ <<< THIS IS THE FIX

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        
        return Response(
            {'detail': 'Invalid email or password'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Handles retrieving (GET) and updating (PUT/PATCH) the user's profile.
    This generic view does all the work for you.
    """
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # This method tells the view how to find the profile
        # object associated with the currently logged-in user.
        return self.request.user.profile
    

class UserPostListView(generics.ListAPIView):
    """
    A view to list all posts created by a specific user.
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        This view should return a list of all the posts
        for the user as determined by the user_id portion of the URL.
        """
        #Get user_id from the url
        user_id = self.kwargs['user_id']
        #Filter the posts by the author's ID
        return Post.objects.filter(author__id=user_id).order_by('-created_at')

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category__name', 'tags__name']
    search_fields = ['title', 'content']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # 👇 log and return clear error
        print("POST /api/posts/ Error:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Post.objects.all()
#     serializer_class = PostSerializer
#     permission_classes = [permissions.IsAuthenticatedOrReadOnly]

#     def update(self, request, *args, **kwargs):
#         post = self.get_object()
#         if request.user != post.author:
#             raise permissions.PermissionDenied("You can only edit your own posts.")
#         return super().update(request, *args, **kwargs)

#     def destroy(self, request, *args, **kwargs):
#         post = self.get_object()
#         if request.user != post.author:
#             raise permissions.PermissionDenied("You can only delete your own posts.")
#         return super().destroy(request, *args, **kwargs)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    # ...
    def update(self, request, *args, **kwargs):
        post = self.get_object()
        if request.user != post.author:
            # Log an info message
            logger.info(f"User {request.user} tried to edit post by {post.author}")
            raise permissions.PermissionDenied("You can only edit your own posts.")
        
        try:
            # Some code that might fail, e.g., processing an image
            return super().update(request, *args, **kwargs)
        except Exception as e:
            # Log the full error message if something goes wrong
            logger.error(f"An error occurred while updating post {post.id}: {e}")
            # Re-raise the exception or return an error response
            raise

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser]
        return [AllowAny()]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser]
        return [AllowAny()]
    

class CategoryPostListView(generics.ListAPIView):
    """
    A view to list all posts belonging to a specific category,
    identified by its slug.
    """
    serializer_class = PostSerializer

    def get_queryset(self):
        # Get the category_slug from the URL
        category_slug = self.kwargs['category_slug']
        # Filter posts where the category's slug matches
        return Post.objects.filter(category__slug=category_slug).order_by('-created_at')


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        # 👇 Yahan 'created_by' ki jagah 'created_at' hoga 👇
        return Comment.objects.filter(post__id=post_id).order_by('-created_at')
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        serializer.save(user=self.request.user, post_id=post_id)

class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user != request.user:
            raise permissions.PermissionDenied("You can only delete your own comments.")
        return super().delete(request, *args, **kwargs)
    

class LikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        user = request.user

        try:
            like = Like.objects.get(user=user, post_id=post_id)
            like.delete()
            return Response({"message": "Post unliked"}, status=status.HTTP_200_OK)
        except Like.DoesNotExist:
            Like.objects.create(user=user, post_id=post_id)
            return Response({"message": "Post linked"}, status=status.HTTP_201_CREATED)

class LikedPostsListView(generics.ListAPIView):
    """
    A view to list all posts liked by the currently authenticated user.
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the posts
        that have been liked by the currently authenticated user.
        """
        user = self.request.user
        # Filter posts where a 'like' from the current user exists
        return Post.objects.filter(like__user=user).order_by('-like__created_at')


class TagListView(generics.ListAPIView):
    """
    A view to list all existing tags.
    """
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny] # Anyone can view the tags