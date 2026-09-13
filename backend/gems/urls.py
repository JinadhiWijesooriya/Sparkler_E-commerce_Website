from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GemViewSet, GemHeroViewSet

router = DefaultRouter()
router.register(r"gems", GemViewSet)
router.register(r"gem-hero", GemHeroViewSet, basename="gem-hero")

urlpatterns = [
    path("", include(router.urls)),
]
