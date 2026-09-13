from django.db import models

# ---------------- GEMS PAGE HERO ----------------
class GemHero(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True, null=True)
    background_image = models.ImageField(upload_to="gems/hero/")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


# ---------------- GEM ----------------
class Gem(models.Model):
    GEM_TYPE_CHOICES = [
        ("Blue Sapphire", "Blue Sapphire"),
        ("Yellow Sapphire", "Yellow Sapphire"),
        ("Pink Sapphire", "Pink Sapphire"),
        ("Ruby", "Ruby"),
        ("Emerald", "Emerald"),
        ("Alexandrite", "Alexandrite"),
        ("Cat's Eye", "Cat's Eye"),
        ("Spinels", "Spinels"),
        ("Tourmaline", "Tourmaline"),
        ("Garnet", "Garnet"),
        ("Topaz", "Topaz"),
        ("Quartz", "Quartz"),
        ("Other", "Other"),
    ]

    ORIGIN_CHOICES = [
        ("Ceylon", "Ceylon (Sri Lanka)"),
        ("Madagascar", "Madagascar"),
        ("Burma", "Burma"),
        ("Mozambique", "Mozambique"),
        ("Colombia", "Colombia"),
        ("Other", "Other"),
    ]

    SHAPE_CHOICES = [
        ("Oval", "Oval"),
        ("Cushion", "Cushion"),
        ("Round", "Round"),
        ("Emerald Cut", "Emerald Cut"),
        ("Pear", "Pear"),
        ("Heart", "Heart"),
        ("Marquise", "Marquise"),
        ("Baguette", "Baguette"),
        ("Square", "Square"),
        ("Octagon", "Octagon"),
        ("Trillion", "Trillion"),
        ("Cabochon", "Cabochon"),
    ]

    name = models.CharField(max_length=200)
    gem_type = models.CharField(max_length=50, choices=GEM_TYPE_CHOICES)
    weight_carat = models.DecimalField(max_digits=10, decimal_places=2)
    shape = models.CharField(max_length=50, choices=SHAPE_CHOICES)
    color = models.CharField(max_length=100)
    origin = models.CharField(max_length=100, choices=ORIGIN_CHOICES, default="Ceylon")
    clarity = models.CharField(max_length=100, blank=True, null=True)
    treatment = models.CharField(max_length=200, blank=True, null=True, help_text="e.g. Heat-treated, Unheated")
    dimensions = models.CharField(max_length=200, blank=True, null=True, help_text="e.g. 10x8x5 mm")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    certification = models.CharField(max_length=200, blank=True, null=True, help_text="e.g. GIC, GIA, EGL")
    availability = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.weight_carat}ct"


# ---------------- GEM IMAGES ----------------
class GemImage(models.Model):
    gem = models.ForeignKey(
        Gem, related_name="images", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="gems/products/")
    alt_text = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.gem.name} Image"
