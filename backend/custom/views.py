from rest_framework import viewsets, filters, permissions  
from rest_framework.decorators import action             
from rest_framework.response import Response             
from django_filters.rest_framework import DjangoFilterBackend

from .models import JewelryType, Gem, Metal,  CustomOrder, HeroSection
from .serializers import (
    JewelryTypeSerializer,
    GemSerializer,
    MetalSerializer,
    CustomOrderSerializer,
    HeroSectionSerializer,
)

# Read-only viewsets for reference data
class JewelryTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = JewelryType.objects.all()
    serializer_class = JewelryTypeSerializer

class GemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Gem.objects.all()
    serializer_class = GemSerializer

class MetalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Metal.objects.all()
    serializer_class = MetalSerializer


class CustomOrderViewSet(viewsets.ModelViewSet):
    queryset = CustomOrder.objects.all().order_by("-created_at")
    serializer_class = CustomOrderSerializer

class HeroSectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer

