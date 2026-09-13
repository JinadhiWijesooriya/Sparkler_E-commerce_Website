from django.contrib import admin
from .models import Service, HeroSection, ServiceImage

class ServiceImageInline(admin.TabularInline):
    model = ServiceImage
    extra = 1

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'icon', 'estimated_cost', 'created_at', 'updated_at')
    search_fields = ('title', 'description')
    list_filter = ('created_at', 'updated_at')
    inlines = [ServiceImageInline]  # show images inline in service admin

@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'badge_text', 'created_at', 'updated_at')
