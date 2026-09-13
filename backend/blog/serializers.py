from rest_framework import serializers
from .models import Article, ArticleImage, HeroSection

# Additional images serializer
class ArticleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleImage
        fields = ["id", "image", "caption"]


# Article serializer
class ArticleSerializer(serializers.ModelSerializer):
    images = ArticleImageSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "category",
            "description",
            "content",
            "featured_image",
            "images",
            "created_at",
        ]


# Hero serializer
class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = ["id", "title", "subtitle", "image", "created_at"]
