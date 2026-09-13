from django.contrib import admin
from .models import Cart, CartItem, Country, Order, CountryOrderSettings

# -------------------------
# CART ITEM INLINE
# -------------------------
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ["name", "price", "total_price"]
    fields = ["product_shop", "product_set", "quantity", "name", "price", "total_price"]

# -------------------------
# CART ADMIN
# -------------------------
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "session_key", "created_at"]
    search_fields = ["id", "user__username", "session_key"]
    inlines = [CartItemInline]

# -------------------------
# CART ITEM ADMIN
# -------------------------
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["id", "cart", "name", "quantity", "price", "total_price"]
    search_fields = ["cart__id", "product_shop__name", "product_set__name"]
    readonly_fields = ["name", "price", "total_price"]

# -------------------------
# ORDER ADMIN
# -------------------------
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["order_id", "user", "full_name", "total", "status", "created_at"]
    search_fields = ["order_id", "user__username", "full_name", "email"]
    readonly_fields = ["order_id", "created_at"]
    list_filter = ["status", "created_at", "city", "country"]
    fields = [
        "user", "cart", "full_name", "email", "phone", "address_1", "address_2",
        "city", "state", "country", "postal_code", "subtotal", "shipping_cost",
        "tax", "vat", "total", "status", "created_at"
    ]

# -------------------------
# COUNTRY ADMIN
# -------------------------
@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]
    search_fields = ["name"]

# -------------------------
# COUNTRY ORDER SETTINGS ADMIN
# -------------------------
@admin.register(CountryOrderSettings)
class CountryOrderSettingsAdmin(admin.ModelAdmin):
    list_display = ["country", "shipping_cost", "tax_rate", "vat_rate"]
    search_fields = ["country__name"]
