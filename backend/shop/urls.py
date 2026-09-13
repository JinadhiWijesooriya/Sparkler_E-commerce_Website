from django.urls import path
from .views import (
    ProductListAPIView,
    ProductDetailAPIView,
    ShopHeroAPIView,
)

urlpatterns = [
    path("hero/", ShopHeroAPIView.as_view(), name="shop-hero"),
    path("products/", ProductListAPIView.as_view(), name="product-list"),
    path("products/<int:pk>/", ProductDetailAPIView.as_view(), name="product-detail"),
]
