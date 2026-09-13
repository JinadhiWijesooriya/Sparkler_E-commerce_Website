from django.urls import path
from .views import ProductListAPIView, ProductDetailAPIView, PageHeroImageAPIView

urlpatterns = [
    path("products/", ProductListAPIView.as_view(), name="product-list"),
    path("products/<int:id>/", ProductDetailAPIView.as_view(), name="product-detail"),
    path("hero/", PageHeroImageAPIView.as_view(), name="page-hero-image"),
]
