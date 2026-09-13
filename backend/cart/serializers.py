from rest_framework import serializers
from .models import Cart, CartItem, Country, CountryOrderSettings, Order


# -------------------------
# CART ITEM SERIALIZER
# -------------------------
class CartItemSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()
    price = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    product_images = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id", "name", "price", "quantity", "total_price",
            "product_shop", "product_set", "product_gem", "product_images",
        ]

    def get_product_images(self, obj):
        request = self.context.get("request")
        images = []

        if obj.product_shop:
            for img in obj.product_shop.images.all():
                if img.image:
                    if request:
                        url = request.build_absolute_uri(img.image.url)
                    else:
                        url = img.image.url
                    images.append({"image": url, "alt_text": img.alt_text or obj.product_shop.name})

        elif obj.product_set:
            for field in ["image_main", "image_secondary"]:
                img_field = getattr(obj.product_set, field, None)
                if img_field:
                    if request:
                        url = request.build_absolute_uri(img_field.url)
                    else:
                        url = img_field.url
                    images.append({"image": url, "alt_text": obj.product_set.name})

        elif obj.product_gem:
            for img in obj.product_gem.images.all():
                if img.image:
                    if request:
                        url = request.build_absolute_uri(img.image.url)
                    else:
                        url = img.image.url
                    images.append({"image": url, "alt_text": img.alt_text or obj.product_gem.name})

        return images


# -------------------------
# CART SERIALIZER
# -------------------------
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "session_key", "items", "created_at"]


# -------------------------
# COUNTRY ORDER SETTINGS SERIALIZER
# -------------------------
class CountryOrderSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryOrderSettings
        fields = ["shipping_cost", "tax_rate", "vat_rate"]


# -------------------------
# COUNTRY SERIALIZER
# -------------------------
class CountrySerializer(serializers.ModelSerializer):
    order_settings = CountryOrderSettingsSerializer(read_only=True)

    class Meta:
        model = Country
        fields = ["id", "name", "order_settings"]


# -------------------------
# ORDER SERIALIZER
# -------------------------
class OrderSerializer(serializers.ModelSerializer):
    cart = CartSerializer(read_only=True)
    country = CountrySerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "order_id",
            "user",
            "cart",
            "full_name",
            "email",
            "phone",
            "address_1",
            "address_2",
            "city",
            "state",
            "country",
            "subtotal",
            "shipping_cost",
            "tax",
            "vat",
            "total",
            "status",
            "payment_method",
            "created_at",
        ]
        read_only_fields = ["order_id", "created_at"]
