from rest_framework import generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Product, PageHeroImage
from .serializers import ProductSerializer, PageHeroImageSerializer

# ---------------- Product List ----------------
class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    filterset_fields = {
        "gem": ["exact"],
        "metal": ["exact"],
        "availability": ["exact"],
        "price": ["gte", "lte"],
    }
    ordering_fields = ["price", "name", "carat"]
    ordering = ["price"]
    search_fields = ["name", "description"]

# ---------------- Product Detail ----------------
class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    lookup_field = "id"

# ---------------- Page Hero Image ----------------
class PageHeroImageAPIView(APIView):
    def get(self, request, *args, **kwargs):
        hero = PageHeroImage.objects.order_by("-created_at").first()
        if not hero:
            return Response({"detail": "No hero image found."}, status=404)
        serializer = PageHeroImageSerializer(hero)
        return Response(serializer.data)
