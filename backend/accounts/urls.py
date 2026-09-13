from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import change_password_view, login_view, register_view, logout_view, update_profile_view

urlpatterns = [
    path("auth/login/", login_view),
    path("auth/register/", register_view),
    path("auth/logout/", logout_view),
    path("auth/profile/", update_profile_view),
    path("auth/change-password/", change_password_view),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
