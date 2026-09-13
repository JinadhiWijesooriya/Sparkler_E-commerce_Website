from rest_framework import serializers
from .models import PromotionSubscriber

class PromotionSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromotionSubscriber
        fields = ['id', 'phone_number', 'consent', 'created_at']