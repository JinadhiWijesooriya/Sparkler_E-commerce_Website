from rest_framework import serializers
from .models import *

# Hero Section
class HeroSerializer(serializers.ModelSerializer):
    background_image = serializers.SerializerMethodField()

    class Meta:
        model = HeroSection
        fields = "__all__"

    def get_background_image(self, obj):
        request = self.context.get('request')
        if obj.background_image:
            return request.build_absolute_uri(obj.background_image.url)
        return None

# Feature
class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = "__all__"

# Collection
class CollectionSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = "__all__"

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

# Custom Jewelry CTA
class CustomJewelryCTASerializer(serializers.ModelSerializer):
    background_image = serializers.SerializerMethodField()

    class Meta:
        model = CustomJewelryCTA
        fields = "__all__"

    def get_background_image(self, obj):
        request = self.context.get('request')
        if obj.background_image:
            return request.build_absolute_uri(obj.background_image.url)
        return None

# Advertisement
class AdvertisementSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Advertisement
        fields = "__all__"

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

# Product Image
class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["image"]

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

# Product
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = "__all__"
