from rest_framework import generics
from .models import SocialLink
from .serializers import SocialLinkSerializer

# List all links (for frontend)
class SocialLinkListAPIView(generics.ListAPIView):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer

# Create a new link
class SocialLinkCreateAPIView(generics.CreateAPIView):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer

# Update an existing link
class SocialLinkUpdateAPIView(generics.UpdateAPIView):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
    lookup_field = 'id'

# Delete a link
class SocialLinkDeleteAPIView(generics.DestroyAPIView):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
    lookup_field = 'id'
