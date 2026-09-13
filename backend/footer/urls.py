from django.urls import path
from .views import (
    SocialLinkListAPIView,
    SocialLinkCreateAPIView,
    SocialLinkUpdateAPIView,
    SocialLinkDeleteAPIView,
)

urlpatterns = [
    path('social-links/', SocialLinkListAPIView.as_view(), name='social-link-list'),
    path('social-links/create/', SocialLinkCreateAPIView.as_view(), name='social-link-create'),
    path('social-links/<int:id>/update/', SocialLinkUpdateAPIView.as_view(), name='social-link-update'),
    path('social-links/<int:id>/delete/', SocialLinkDeleteAPIView.as_view(), name='social-link-delete'),
]
