from rest_framework import serializers
from .models import AuctionItem, AuctionPageBackground, Bid
from django.utils import timezone

class BidSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Bid
        fields = ["user", "amount", "timestamp"]

    def get_user(self, obj):
        return {
            "name": obj.user.first_name or "",
            "email": obj.user.email
        }

class AuctionItemSerializer(serializers.ModelSerializer):
    bids = BidSerializer(many=True, read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    time_left = serializers.SerializerMethodField()

    class Meta:
        model = AuctionItem
        fields = [
            "id", "name", "image", "description", "starting_price", 
            "current_bid", "duration", "bids", 
            "bid_increment", "end_time", "time_left", "ending_price",
            "is_active"
        ]

    def get_time_left(self, obj):
        """
        Returns the remaining time in seconds for the auction.
        If is_active is False, end_time is None, or in the past, returns 0.
        """
        if not obj.is_active or not obj.end_time:
            return 0
        
        delta = obj.end_time - timezone.now()
        return max(int(delta.total_seconds()), 0)

class AuctionPageBackgroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionPageBackground
        fields = ("image",)
