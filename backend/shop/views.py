from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, ShopHero
from .serializers import ProductSerializer, ShopHeroSerializer


# ---------------- SHOP HERO ----------------
class ShopHeroAPIView(APIView):
    def get(self, request):
        hero = ShopHero.objects.first()
        if not hero:
            return Response(None)
        serializer = ShopHeroSerializer(hero)
        return Response(serializer.data)


# ---------------- PRODUCT LIST ----------------
class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]

    filterset_fields = {
        "gem": ["exact"],
        "metal": ["exact"],
        "availability": ["exact"],
        "price": ["gte", "lte"],
    }

    ordering_fields = ["price", "name", "carat"]
    ordering = ["price"]
    search_fields = ["name", "description"]


# ---------------- PRODUCT DETAIL ----------------
class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
