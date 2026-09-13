from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('home.urls')),
    path("api/", include("accounts.urls")),
    path('api/shop/', include('shop.urls')),
    path('api/shop_sets/', include('shop_sets.urls')),
    path('api/', include('services.urls')),
    path("api/blog/", include("blog.urls")),
    path('custom/', include('custom.urls')),
    path("api/contact/", include("contact.urls")),
    path('api/footer/', include('footer.urls')),
    path("api/cart/", include("cart.urls")),
    path('api/', include('auctions.urls')),
    path('api/promotions/', include('promotions.urls')),
    path('api/gems/', include('gems.urls')),

    # Serve static and media files in container
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
