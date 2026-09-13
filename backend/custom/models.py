from django.db import models
from django.contrib.auth.models import User 

# ---------------- Jewelry Type ----------------
class JewelryType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


# ---------------- Gem ----------------
class Gem(models.Model):
    name = models.CharField(max_length=50, unique=True)
    multiplier = models.FloatField(default=1.0)
    image = models.ImageField(upload_to="gems/", blank=True, null=True)

    def __str__(self):
        return self.name


# ---------------- Metal ----------------
class Metal(models.Model):
    name = models.CharField(max_length=50, unique=True)
    multiplier = models.FloatField(default=1.0)
    image = models.ImageField(upload_to="metals/", blank=True, null=True)

    def __str__(self):
        return self.name



# ---------------- Custom Order ----------------
class CustomOrder(models.Model):
    jewelry_type = models.ForeignKey(JewelryType, on_delete=models.CASCADE)
    gem = models.ForeignKey(Gem, on_delete=models.CASCADE)
    metal = models.ForeignKey(Metal, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    price = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} - {self.jewelry_type} ({self.gem}, {self.metal})"


# ---------------- Hero Section ----------------
class HeroSection(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="hero_images/")

    def __str__(self):
        return self.title


