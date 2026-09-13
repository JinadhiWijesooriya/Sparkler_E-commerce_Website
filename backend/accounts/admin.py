from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

# Define an inline admin descriptor for UserProfile model
# which acts a bit like a singleton
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "Profile"
    fk_name = "user"

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_phone')
    
    def get_phone(self, obj):
        return obj.userprofile.phone if hasattr(obj, "userprofile") else ""
    get_phone.short_description = 'Phone'

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
