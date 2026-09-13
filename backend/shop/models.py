from django.db import models

# ---------------- SHOP PAGE HERO ----------------
class ShopHero(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True, null=True)
    background_image = models.ImageField(upload_to="shop/hero/")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


# ---------------- PRODUCT ----------------
class Product(models.Model):
    GEM_CHOICES = [
        ("Sapphire", "Sapphire"),
        ("Ruby", "Ruby"),
        ("Emerald", "Emerald"),
        ("Diamond", "Diamond"),
    ]

    METAL_CHOICES = [
        ("Gold", "Gold"),
        ("Silver", "Silver"),
        ("Platinum", "Platinum"),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    gem = models.CharField(max_length=50, choices=GEM_CHOICES)
    carat = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)
    metal = models.CharField(max_length=50, choices=METAL_CHOICES)
    certification = models.BooleanField(default=True)
    availability = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ---------------- PRODUCT IMAGES ----------------
class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, related_name="images", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.product.name} Image"
