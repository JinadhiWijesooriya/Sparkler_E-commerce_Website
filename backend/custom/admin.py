from django.contrib import admin
from .models import JewelryType, Gem, Metal, CustomOrder, HeroSection

@admin.register(JewelryType)
class JewelryTypeAdmin(admin.ModelAdmin):
    list_display = ["name"]

@admin.register(Gem)
class GemAdmin(admin.ModelAdmin):
    list_display = ["name", "multiplier", "image"]

@admin.register(Metal)
class MetalAdmin(admin.ModelAdmin):
    list_display = ["name", "multiplier", "image"]


@admin.register(CustomOrder)
class CustomOrderAdmin(admin.ModelAdmin):
    list_display = ["customer_name", "jewelry_type", "gem", "metal", "price", "created_at"]
    list_filter = ["jewelry_type", "gem", "metal", "created_at"]

@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ["title", "subtitle", "image"]
