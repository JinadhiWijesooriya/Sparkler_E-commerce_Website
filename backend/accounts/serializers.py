from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile

User = get_user_model()


# ---------------- JWT LOGIN ----------------
class JWTLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not check_password(data["password"], user.password):
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        phone = getattr(user.userprofile, "phone", "")

        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.first_name,
                "phone": phone,
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }


# ---------------- REGISTER ----------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    

    class Meta:
        model = User
        fields = ("id", "email", "password", "first_name", "phone")

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        phone = validated_data.pop("phone", "") 
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=password,
            first_name=validated_data.get("first_name", "")
        )
        # Create UserProfile
        UserProfile.objects.create(user=user, phone=phone)
        return user


# ---------------- UPDATE PROFILE ----------------
class UpdateProfileSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="userprofile.phone", required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ("email", "first_name", "phone")

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("userprofile", {})
        phone = profile_data.get("phone")
        if phone is not None:
            if not hasattr(instance, "userprofile"):
                UserProfile.objects.create(user=instance, phone=phone)
            else:
                instance.userprofile.phone = phone
                instance.userprofile.save()
        return super().update(instance, validated_data)


# ---------------- CHANGE PASSWORD ----------------
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
