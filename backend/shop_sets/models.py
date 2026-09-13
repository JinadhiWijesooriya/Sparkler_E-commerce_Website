from django.db import models

class Product(models.Model):
    GEM_CHOICES = [
        ("diamond", "Diamond"),
        ("ruby", "Ruby"),
        ("emerald", "Emerald"),
        ("sapphire", "Sapphire"),
    ]

    METAL_CHOICES = [
        ("gold", "Gold"),
        ("silver", "Silver"),
        ("platinum", "Platinum"),
    ]

    AVAILABILITY_CHOICES = [
        ("in_stock", "In Stock"),
        ("out_of_stock", "Out of Stock"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    gem = models.CharField(max_length=50, choices=GEM_CHOICES)
    metal = models.CharField(max_length=50, choices=METAL_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    carat = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default="in_stock")
    image_main = models.ImageField(upload_to="products/")
    image_secondary = models.ImageField(upload_to="products/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PageHeroImage(models.Model):
    """
    Hero image for the shop page (not tied to any product)
    """
    title = models.CharField(max_length=255, blank=True, help_text="Optional title for the hero section")
    subtitle = models.TextField(blank=True, help_text="Optional subtitle for the hero section")
    background_image = models.ImageField(upload_to="hero/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Hero Image ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
