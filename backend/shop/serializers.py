from rest_framework import serializers
from .models import Product, ProductImage, ShopHero


class ShopHeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopHero
        fields = [
            "id",
            "title",
            "subtitle",
            "background_image",
            "created_at",
        ]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "gem",
            "carat",
            "metal",
            "certification",
            "availability",
            "images",
        ]
