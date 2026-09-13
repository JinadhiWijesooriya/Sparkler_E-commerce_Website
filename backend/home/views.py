from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *

@api_view(["GET"])
def homepage_data(request):
    hero = HeroSection.objects.filter(is_active=True).first()
    cta = CustomJewelryCTA.objects.filter(is_active=True).first()

    return Response({
        "hero": HeroSerializer(hero, context={'request': request}).data if hero else None,
        "features": FeatureSerializer(
            Feature.objects.filter(is_active=True),
            many=True,
            context={'request': request}
        ).data,
        "collections": CollectionSerializer(
            Collection.objects.filter(is_featured=True),
            many=True,
            context={'request': request}
        ).data,
        "cta": CustomJewelryCTASerializer(cta, context={'request': request}).data if cta else None,
        "ads": AdvertisementSerializer(
            Advertisement.objects.filter(is_active=True),
            many=True,
            context={'request': request}
        ).data,
        "products": ProductSerializer(
            Product.objects.filter(is_popular=True),
            many=True,
            context={'request': request}
        ).data,
    })
