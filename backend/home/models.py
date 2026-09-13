from django.db import models

class HeroSection(models.Model):
    badge_text = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    subtitle = models.TextField()
    background_image = models.ImageField(upload_to="hero/")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Feature(models.Model):
    title = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Collection(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="collections/")
    slug = models.SlugField(unique=True)
    is_featured = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class CustomJewelryCTA(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField()
    background_image = models.ImageField(upload_to="cta/")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Advertisement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to="ads/")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_popular = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="products/")

    def __str__(self):
        return f"{self.product.name} Image"
