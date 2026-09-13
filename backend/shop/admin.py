from django.contrib import admin
from .models import Product, ProductImage, ShopHero


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "gem", "metal", "availability"]
    list_filter = ["gem", "metal", "availability"]
    search_fields = ["name", "description"]
    inlines = [ProductImageInline]


@admin.register(ShopHero)
class ShopHeroAdmin(admin.ModelAdmin):
    list_display = ["title", "created_at"]
