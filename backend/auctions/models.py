from django.db import models
from django.conf import settings
from django.utils import timezone



class AuctionPageBackground(models.Model):
    image = models.ImageField(upload_to="auction_page_background/")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "Auction Page Background"

class AuctionItem(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to="auction_items/")
    description = models.TextField()
    starting_price = models.DecimalField(max_digits=12, decimal_places=2)
    current_bid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    duration = models.IntegerField(help_text="Auction duration in seconds")
    end_time = models.DateTimeField(null=True, blank=True)  
    bid_increment = models.DecimalField(max_digits=12, decimal_places=2, default=500)
    ending_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True, help_text="Set whether this bid is open/active")

    def save(self, *args, **kwargs):
        # Set end_time if not already set
        if not self.end_time and self.duration:
            self.end_time = timezone.now() + timezone.timedelta(seconds=self.duration)
        super().save(*args, **kwargs)
        
        
    def time_left(self):
        """Return remaining seconds"""
        if not self.end_time or not self.is_active:
            return 0
        remaining = (self.end_time - timezone.now()).total_seconds()
        return max(0, int(remaining))
    
    def __str__(self):
        return self.name

class Bid(models.Model):
    auction_item = models.ForeignKey(AuctionItem, related_name="bids", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.amount}"
