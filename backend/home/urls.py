from django.urls import path
from .views import homepage_data

urlpatterns = [
    path('home/', homepage_data),
]
