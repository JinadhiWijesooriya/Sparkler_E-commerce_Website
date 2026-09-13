from rest_framework import serializers
from .models import ContactHero, ContactInfo

class ContactHeroSerializer(serializers.ModelSerializer):
    background_image = serializers.SerializerMethodField()

    class Meta:
        model = ContactHero
        fields = "__all__"

    def get_background_image(self, obj):
        request = self.context.get("request")
        if obj.background_image and request:
            return request.build_absolute_uri(obj.background_image.url)
        return None


class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = "__all__"
