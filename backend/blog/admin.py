from django.contrib import admin
from .models import Article, ArticleImage, HeroSection

# Inline for additional images
class ArticleImageInline(admin.TabularInline):
    model = ArticleImage
    extra = 1


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "created_at")
    search_fields = ("title", "category")
    inlines = [ArticleImageInline]


@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at")
    search_fields = ("title",)
