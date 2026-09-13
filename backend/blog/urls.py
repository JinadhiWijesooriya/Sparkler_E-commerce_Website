from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, HeroSectionViewSet

router = DefaultRouter()
router.register(r"articles", ArticleViewSet, basename="article")
router.register(r"hero", HeroSectionViewSet, basename="hero")

urlpatterns = [
    path("", include(router.urls)),
]
