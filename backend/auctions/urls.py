from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuctionItemViewSet, AuctionPageBackgroundViewSet

router = DefaultRouter()
router.register(r'auctions', AuctionItemViewSet)
router.register(r'auction-page-background', AuctionPageBackgroundViewSet, basename='auction-background')


urlpatterns = [
    path('', include(router.urls)),
]
