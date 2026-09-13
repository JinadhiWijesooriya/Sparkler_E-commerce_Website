from django.urls import path
from .views import (
    AllOrdersAPIView,
    CartAPIView,
    AddToCartAPIView,
    OrderDetailAPIView,
    PendingOrdersAPIView,
    UpdateCartItemAPIView,
    RemoveCartItemAPIView,
    CheckoutAPIView,
    CountriesAPIView,
    VerifyPaymentAPIView,
)

urlpatterns = [
    path("", CartAPIView.as_view(), name="cart"),
    path("add/", AddToCartAPIView.as_view(), name="add-to-cart"),
    path("update/<int:pk>/", UpdateCartItemAPIView.as_view(), name="update-cart-item"),
    path("remove/<int:pk>/", RemoveCartItemAPIView.as_view(), name="remove-cart-item"),
    path("checkout/", CheckoutAPIView.as_view(), name="checkout"),
    path("countries/", CountriesAPIView.as_view(), name="countries"),
    path("order/<str:order_id>/", OrderDetailAPIView.as_view(), name="order-detail"),
    path("order/<str:order_id>/verify/", VerifyPaymentAPIView.as_view(), name="verify-payment"),
    path("orders/pending/", PendingOrdersAPIView.as_view(), name="pending-orders"),
    path("orders/", AllOrdersAPIView.as_view(), name="all-orders"),

]
