from django.urls import path
from .views import ContactInfoAPIView, ContactHeroAPIView

urlpatterns = [
    path("info/", ContactInfoAPIView.as_view(), name="contact-info"),
    path("hero/", ContactHeroAPIView.as_view(), name="contact-hero"),
]
