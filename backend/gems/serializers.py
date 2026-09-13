from rest_framework import serializers
from .models import Gem, GemHero, GemImage

class GemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GemImage
        fields = ["id", "image", "alt_text"]

class GemSerializer(serializers.ModelSerializer):
    images = GemImageSerializer(many=True, read_only=True)

    class Meta:
        model = Gem
        fields = [
            "id", "name", "gem_type", "weight_carat", "shape", 
            "color", "origin", "clarity", "treatment", 
            "dimensions", "price", "description", 
            "certification", "availability", "images", "created_at"
        ]

class GemHeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = GemHero
        fields = ["id", "title", "subtitle", "background_image"]
