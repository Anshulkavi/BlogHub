from pathlib import Path
import os
import dj_database_url
from decouple import config
from datetime import timedelta
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent

# =========================
# Core Settings
# =========================
SECRET_KEY = config("SECRET_KEY")
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = ["localhost", "127.0.0.1", ".onrender.com"]


# =========================
# Installed Apps
# =========================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'cloudinary',
    'cloudinary_storage',

    # Local apps
    'blog',
]

# =========================
# Middleware
# =========================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # Place WhiteNoise right after SecurityMiddleware
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # Place CorsMiddleware right after WhiteNoise
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'blogging_platform.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Add your templates folder if needed
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'blogging_platform.wsgi.application'

# =========================
# Database
# =========================
DATABASE_URL = config("DATABASE_URL", default=None)
if not DATABASE_URL:
    raise ImproperlyConfigured("DATABASE_URL not found. Please set it in .env")

DATABASES = {
    "default": dj_database_url.parse(DATABASE_URL, conn_max_age=600)
}

# =========================
# Authentication
# =========================
AUTH_USER_MODEL = 'blog.CustomUser'
AUTHENTICATION_BACKENDS = [
    'blog.backends.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# =========================
# Internationalization
# =========================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -----------------
# Static Files
# -----------------
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# -----------------
# Cloudinary Media Storage
# -----------------
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': config('CLOUD_NAME'),
    'API_KEY': config('CLOUD_API_KEY'),
    'API_SECRET': config('CLOUD_API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
MEDIA_URL = '/media/'  # Placeholder, Cloudinary will handle actual URLs

# Optional: For local uploads in dev mode
if DEBUG:
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# =========================
# REST Framework
# =========================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',  # Override in views
    ),
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
    ],
     # Pagination
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

# =========================
# JWT Settings
# =========================
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# =========================
# CORS & CSRF
# =========================
# Read the frontend URL from an environment variable
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:5173')

CORS_ALLOWED_ORIGINS = [
    FRONTEND_URL,
]
# It's also good practice to add your frontend to CSRF_TRUSTED_ORIGINS
CSRF_TRUSTED_ORIGINS = [
    FRONTEND_URL,
    # Also add your backend's URL here once it's deployed
    # e.g., 'https://your-backend-name.onrender.com'
]
# =========================
# Logging
# =========================
# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'verbose': {
#             'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
#             'style': '{',
#         },
#     },
#     'handlers': {
#         'console': {
#             'class': 'logging.StreamHandler',
#             'formatter': 'verbose',
#         },
#     },
#     'root': {
#         'handlers': ['console'],
#         'level': 'INFO',
#     },
#     'loggers': {
#         'django.db.backends': {
#             'handlers': ['console'],
#             'level': 'DEBUG',
#             'propagate': False,
#         },
#     },
# }

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
