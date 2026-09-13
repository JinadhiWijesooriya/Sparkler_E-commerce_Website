from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Article, HeroSection
from .serializers import ArticleSerializer, HeroSectionSerializer

# ================= ARTICLES VIEW =================
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.all().order_by("-created_at")
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category"]
    search_fields = ["title", "category", "description", "content"]
    ordering_fields = ["created_at"]


# ================= HERO VIEW =================
class HeroSectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HeroSection.objects.all().order_by("-created_at")
    serializer_class = HeroSectionSerializer
