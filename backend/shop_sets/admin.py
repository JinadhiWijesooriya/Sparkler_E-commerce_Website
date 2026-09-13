from django.contrib import admin
from .models import Product, PageHeroImage

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "gem", "metal", "price", "availability", "created_at"]
    list_filter = ["gem", "metal", "availability"]
    search_fields = ["name", "description"]
    readonly_fields = ["created_at"]


@admin.register(PageHeroImage)
class PageHeroImageAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "created_at"]
    readonly_fields = ["created_at"]
