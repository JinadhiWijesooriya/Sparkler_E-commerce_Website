from django.urls import path
from .views import ServiceListAPIView, ServiceDetailAPIView, HeroSectionAPIView

urlpatterns = [
    path('hero/', HeroSectionAPIView.as_view(), name='hero-section'),
    path('services/', ServiceListAPIView.as_view(), name='service-list'),
    path('services/<int:id>/', ServiceDetailAPIView.as_view(), name='service-detail'),
]
