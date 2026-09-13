from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    JewelryTypeViewSet, GemViewSet, MetalViewSet, CustomOrderViewSet, HeroSectionViewSet, 
)

router = DefaultRouter()
router.register(r'jewelry-types', JewelryTypeViewSet, basename='jewelry-types')
router.register(r'gems', GemViewSet, basename='gems')
router.register(r'metals', MetalViewSet, basename='metals')
router.register(r'custom-orders', CustomOrderViewSet, basename='custom-orders')
router.register(r'hero-section', HeroSectionViewSet, basename='hero-section')

urlpatterns = [
    path('', include(router.urls)),
]
