from rest_framework import serializers
from .models import JewelryType, Gem, Metal, CustomOrder, HeroSection

class JewelryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = JewelryType
        fields = ["id", "name"]

class GemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gem
        fields = ["id", "name", "multiplier", "image"]

class MetalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metal
        fields = ["id", "name", "multiplier", "image"]



class CustomOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomOrder
        fields = "__all__"

class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = ["id", "title", "subtitle", "image"]


