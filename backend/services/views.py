from rest_framework import generics, filters
from .models import Service, HeroSection
from .serializers import ServiceSerializer, HeroSectionSerializer

# Hero section API
class HeroSectionAPIView(generics.ListAPIView):
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer

# List all services
class ServiceListAPIView(generics.ListAPIView):
    queryset = Service.objects.all().order_by('title')
    serializer_class = ServiceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'estimated_cost']
    ordering = ['title']

# Retrieve a single service by ID
class ServiceDetailAPIView(generics.RetrieveAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    lookup_field = 'id'
