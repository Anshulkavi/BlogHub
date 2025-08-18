from rest_framework import serializers
from .models import CustomUser, Profile, Post, Tag, Category, Comment,Like

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'full_name', 'password')  # ✅ Replace `username`
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data.get('full_name', ''),
            password=validated_data['password']
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    # 👇 ADD THESE FIELDS TO INCLUDE DATA FROM THE RELATED USER MODEL 👇

    # Get the user's ID. source='user.id' tells DRF to look at the
    # 'user' object connected to the profile and get its 'id' attribute.
    id = serializers.ReadOnlyField(source='user.id')

    # Get the user's username
    username = serializers.ReadOnlyField(source='user.username')

    # Get the user's email
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Profile
        # Add the new fields to the 'fields' list
        fields = ('id', 'username', 'email', 'full_name', 'bio', 'profile_picture')


# Ek simple Profile serializer banayein jo author ke saath nest hoga
class ProfileNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['full_name', 'profile_picture']

# Ek simple User serializer banayein jo Profile ko nest karega
class UserNestedSerializer(serializers.ModelSerializer):
    profile = ProfileNestedSerializer(read_only=True)
    class Meta:
        model = CustomUser # Or your actual User model
        fields = ['id', 'email', 'profile']

# Ab PostSerializer ko update karein
class PostSerializer(serializers.ModelSerializer):
    # author field ab UserNestedSerializer se poori details dega
    author = UserNestedSerializer(read_only=True)
    
    tags = serializers.SlugRelatedField(
        many=True, 
        slug_field='name', 
        queryset=Tag.objects.all(),
        required=False
    )
    category = serializers.SlugRelatedField(
        slug_field='name', 
        queryset=Category.objects.all(),
        allow_null=True,
        required=False
    )
    featured_image = serializers.CharField(max_length=255, required=False, allow_null=True)

    # likes_count aur is_liked jaise custom fields add karein
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'content', 'featured_image', 'category', 'tags', 
            'created_at', 'author', 'likes_count', 'is_liked'
        ]

    # Yeh function post ke likes ka count return karega
    def get_likes_count(self, obj):
        return obj.like.count()

    # Yeh function batayega ki current user ne post like kiya hai ya nahi
    def get_is_liked(self, obj):
        # request ko context se access karna zaroori hai
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.like.filter(user=request.user).exists()
        return False
    
class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.profile.full_name')
    user_id = serializers.ReadOnlyField(source='user.id')
    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'user_id', 'user_name']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


# blog/serializers.py
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        # Add 'slug' to the list of fields
        fields = ['id', 'name', 'slug']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
