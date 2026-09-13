from django.contrib import admin
from .models import Gem, GemHero, GemImage

class GemImageInline(admin.TabularInline):
    model = GemImage
    extra = 1

@admin.register(Gem)
class GemAdmin(admin.ModelAdmin):
    list_display = ["name", "gem_type", "weight_carat", "price", "origin", "availability"]
    list_filter = ["gem_type", "origin", "shape", "availability"]
    search_fields = ["name", "description", "color"]
    inlines = [GemImageInline]

@admin.register(GemHero)
class GemHeroAdmin(admin.ModelAdmin):
    list_display = ["title", "created_at"]
