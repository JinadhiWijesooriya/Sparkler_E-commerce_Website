from django.contrib import admin
from .models import (
    HeroSection,
    Feature,
    Collection,
    CustomJewelryCTA,
    Advertisement,
    Product,
    ProductImage,
)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "is_popular")
    inlines = [ProductImageInline]


admin.site.register(HeroSection)
admin.site.register(Feature)
admin.site.register(Collection)
admin.site.register(CustomJewelryCTA)
admin.site.register(Advertisement)
admin.site.register(Product, ProductAdmin)
