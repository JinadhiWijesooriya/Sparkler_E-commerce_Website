from rest_framework import viewsets
from .models import Gem, GemHero
from .serializers import GemSerializer, GemHeroSerializer

class GemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Gem.objects.filter(availability=True)
    serializer_class = GemSerializer
    filterset_fields = ["gem_type", "origin", "shape"]
    search_fields = ["name", "description"]

class GemHeroViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GemHero.objects.all()
    serializer_class = GemHeroSerializer

    def get_queryset(self):
        # Return only the most recent hero
        return GemHero.objects.all()[:1]
