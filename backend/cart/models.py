import random
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from shop.models import Product as ShopProduct
from shop_sets.models import Product as SetsProduct
from gems.models import Gem

User = get_user_model()


# -------------------------
# ORDER ID GENERATOR
# -------------------------
def generate_order_id():
    date_part = timezone.now().strftime("%Y%m%d")
    random_part = random.randint(1000, 9999)
    return f"SPK-{date_part}-{random_part}"


# -------------------------
# COUNTRY
# -------------------------
class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.name


# -------------------------
# COUNTRY-SPECIFIC ORDER SETTINGS
# -------------------------
class CountryOrderSettings(models.Model):
    country = models.OneToOneField(
        Country, on_delete=models.CASCADE, related_name="order_settings"
    )
    shipping_cost = models.FloatField(default=0)
    tax_rate = models.FloatField(default=0.07)  # 7% default
    vat_rate = models.FloatField(default=0.0)

    def __str__(self):
        return f"Order Settings ({self.country.name})"


# -------------------------
# CART
# -------------------------
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.id}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    product_shop = models.ForeignKey(
        ShopProduct, on_delete=models.SET_NULL, null=True, blank=True
    )
    product_set = models.ForeignKey(
        SetsProduct, on_delete=models.SET_NULL, null=True, blank=True
    )
    product_gem = models.ForeignKey(
        Gem, on_delete=models.SET_NULL, null=True, blank=True
    )
    quantity = models.PositiveIntegerField(default=1)

    @property
    def name(self):
        if self.product_shop:
            return self.product_shop.name
        if self.product_set:
            return self.product_set.name
        if self.product_gem:
            return self.product_gem.name
        return "Unknown Product"

    @property
    def price(self):
        if self.product_shop:
            return float(self.product_shop.price)
        if self.product_set:
            return float(self.product_set.price)
        if self.product_gem:
            return float(self.product_gem.price)
        return 0.0

    @property
    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.name} x {self.quantity}"


# -------------------------
# ORDER SETTINGS (GLOBAL)
# -------------------------
class OrderSettings(models.Model):
    shipping_cost = models.FloatField(default=0)
    tax_rate = models.FloatField(default=0.07)
    vat_rate = models.FloatField(default=0.0)

    def __str__(self):
        return "Order Settings"


# -------------------------
# ORDER
# -------------------------
class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    cart = models.ForeignKey(
        Cart, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders"
    )

    order_id = models.CharField(
        max_length=30,
        unique=True,
        default=generate_order_id,
        editable=False
    )

    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)

    address_1 = models.CharField(max_length=255)
    address_2 = models.CharField(max_length=255, blank=True, null=True)

    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)

    country = models.ForeignKey(
        Country, on_delete=models.SET_NULL, null=True, blank=True
    )

    postal_code = models.CharField(max_length=20, blank=True, null=True)

    subtotal = models.FloatField()
    shipping_cost = models.FloatField()
    tax = models.FloatField()
    vat = models.FloatField(default=0)
    total = models.FloatField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )
    
    PAYMENT_CHOICES = [
        ("card", "Card"),
        ("cod", "Cash on Delivery")
    ]
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_CHOICES,
        default="card"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_id}"