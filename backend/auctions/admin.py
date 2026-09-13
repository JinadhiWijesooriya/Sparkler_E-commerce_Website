from django.contrib import admin
from django import forms
from .models import AuctionItem, AuctionPageBackground, Bid

# ------------------------------
# Custom Form for AuctionItem
# ------------------------------
class AuctionItemForm(forms.ModelForm):
    duration_hours = forms.FloatField(
        label="Duration (hours)",
        required=True,
        help_text="Enter auction duration in hours"
    )

    class Meta:
        model = AuctionItem
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Pre-fill duration_hours from seconds if instance exists
        if self.instance and self.instance.duration is not None:
            self.fields['duration_hours'].initial = self.instance.duration / 3600

    def save(self, commit=True):
        from django.utils import timezone
        # Convert hours to seconds before saving the model
        self.instance.duration = int(self.cleaned_data['duration_hours'] * 3600)
        # If admin sets/leaves is_active=True and end_time has passed or is unset, reset end_time to now + duration
        if self.cleaned_data.get('is_active') and (not self.instance.end_time or self.instance.end_time <= timezone.now()):
            self.instance.end_time = timezone.now() + timezone.timedelta(seconds=self.instance.duration)
        return super().save(commit=commit)

# ------------------------------
# AuctionItem Admin
# ------------------------------
@admin.register(AuctionItem)
class AuctionItemAdmin(admin.ModelAdmin):
    form = AuctionItemForm
    list_display = ["name", "is_active", "time_left_display", "current_bid", "starting_price", "ending_price", "bid_increment", "duration_display"]
    list_editable = ["is_active", "current_bid", "starting_price", "ending_price", "bid_increment"]
    search_fields = ["name"]
    list_filter = ["is_active", "duration"]
    fieldsets = (
        (None, {
            "fields": ("name", "description", "image", "is_active")
        }),
        ("Auction Details", {
            "fields": ("starting_price", "ending_price", "current_bid", "bid_increment", "duration_hours", "end_time")
        }),
    )

    def duration_display(self, obj):
        hours = obj.duration / 3600
        return f"{hours:.2f} h"
    duration_display.short_description = "Duration (hours)"

    def time_left_display(self, obj):
        secs = obj.time_left()
        if secs <= 0 or not obj.is_active:
            return "Closed"
        h = secs // 3600
        m = (secs % 3600) // 60
        s = secs % 60
        return f"{h}h {m}m {s}s"
    time_left_display.short_description = "Status / Time Left"
    
    
# ------------------------------
# Page Background Admin
# ------------------------------
@admin.register(AuctionPageBackground)
class AuctionPageBackgroundAdmin(admin.ModelAdmin):
    list_display = ("image", "is_active")
    list_filter = ("is_active",)

# ------------------------------
# Bid Admin
# ------------------------------
@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ["auction_item", "user", "amount", "timestamp"]
    list_filter = ["auction_item", "timestamp"]
    search_fields = ["user__email", "auction_item__name"]
