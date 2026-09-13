from django.contrib import admin
from .models import PromotionSubscriber

@admin.register(PromotionSubscriber)
class PromotionSubscriberAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'consent', 'created_at')  # Columns shown in admin list
    list_filter = ('consent', 'created_at')  # Filters in the sidebar
    search_fields = ('phone_number',)  # Search by phone number
    ordering = ('-created_at',)  # Latest first