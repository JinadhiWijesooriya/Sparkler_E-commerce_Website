from rest_framework import serializers
from .models import Service, HeroSection, ServiceImage

class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = ['id', 'badge_text', 'title', 'subtitle', 'background_image']


class ServiceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceImage
        fields = ['id', 'image', 'is_before']


class ServiceSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    images = ServiceImageSerializer(many=True, read_only=True)  # nested images

    def get_video_url(self, obj):
        if obj.video:
            return obj.video.url
        return None

    class Meta:
        model = Service
        fields = ['id', 'title', 'icon', 'description', 'estimated_cost', 'video_url', 'images']
