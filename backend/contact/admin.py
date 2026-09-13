from django.contrib import admin
from .models import ContactInfo, ContactHero

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ["email", "phone", "address"]

@admin.register(ContactHero)
class ContactHeroAdmin(admin.ModelAdmin):
    list_display = ["title", "subtitle", "map_url"]
