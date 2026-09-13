from rest_framework import serializers
from .models import Product, PageHeroImage

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["id", "created_at"]

class PageHeroImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageHeroImage
        fields = "__all__"
        read_only_fields = ["id", "created_at"]
