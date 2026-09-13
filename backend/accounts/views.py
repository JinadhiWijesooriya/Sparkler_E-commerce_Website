from django.contrib.auth import login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from cart.models import Cart, CartItem
from .serializers import (
    JWTLoginSerializer,
    RegisterSerializer,
    UpdateProfileSerializer,
    ChangePasswordSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile

User = get_user_model()


# ---------------- HELPER: MERGE CART ----------------
def merge_guest_cart_to_user(request, user):
    session_key = request.session.session_key
    if not session_key:
        return

    try:
        guest_cart = Cart.objects.get(session_key=session_key)
    except Cart.DoesNotExist:
        return

    user_cart, _ = Cart.objects.get_or_create(user=user)

    for item in guest_cart.items.all():
        existing_item = CartItem.objects.filter(
            cart=user_cart,
            shop_product=item.shop_product,
            sets_product=item.sets_product,
        ).first()

        if existing_item:
            existing_item.quantity += item.quantity
            existing_item.save()
        else:
            item.cart = user_cart
            item.pk = None
            item.save()

    guest_cart.delete()


# ---------------- REGISTER ----------------
@api_view(["POST"])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        user = serializer.save()
    except Exception as e:
        print("Register Error:", e)
        return Response({"error": str(e)}, status=500)

    # Ensure UserProfile exists
    if not hasattr(user, "userprofile"):
        UserProfile.objects.create(user=user, phone=request.data.get("phone", ""))

    refresh = RefreshToken.for_user(user)
    login(request, user)
    merge_guest_cart_to_user(request, user)

    return Response(
        {
            "message": "Registered & logged in",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.first_name,
                "phone": getattr(user.userprofile, "phone", ""),
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    )


# ---------------- LOGIN ----------------
@csrf_exempt
@api_view(["POST"])
def login_view(request):
    serializer = JWTLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user_data = serializer.validated_data
    user = User.objects.get(id=user_data["user"]["id"])

    login(request, user)
    merge_guest_cart_to_user(request, user)

    return Response(
        {
            "message": "Login successful",
            "user": user_data["user"],
            "access": user_data["access"],
            "refresh": user_data["refresh"],
        }
    )


# ---------------- LOGOUT ----------------
@csrf_exempt
@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"message": "Logged out"})


# ---------------- UPDATE PROFILE ----------------
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    # Update UserProfile phone if provided
    phone = request.data.get("phone")
    if phone is not None:
        if hasattr(request.user, "userprofile"):
            request.user.userprofile.phone = phone
            request.user.userprofile.save()
        else:
            UserProfile.objects.create(user=request.user, phone=phone)

    return Response(
        {
            "message": "Profile updated",
            "user": {
                "id": request.user.id,
                "email": request.user.email,
                "name": request.user.first_name,
                "phone": getattr(request.user.userprofile, "phone", ""),
            },
        }
    )


# ---------------- CHANGE PASSWORD ----------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    serializer = ChangePasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = request.user

    if not user.check_password(serializer.validated_data["old_password"]):
        return Response({"error": "Wrong password"}, status=400)

    user.set_password(serializer.validated_data["new_password"])
    user.save()

    return Response({"message": "Password changed successfully"})
