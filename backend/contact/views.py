from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ContactInfo, ContactHero
from .serializers import ContactInfoSerializer, ContactHeroSerializer

# ---------------- GET CONTACT INFO ----------------
class ContactInfoAPIView(APIView):
    def get(self, request):
        info = ContactInfo.objects.first()
        serializer = ContactInfoSerializer(info)
        return Response(serializer.data)


# ---------------- GET HERO SECTION ----------------
class ContactHeroAPIView(APIView):
    def get(self, request):
        hero = ContactHero.objects.first()
        serializer = ContactHeroSerializer(
            hero,
            context={"request": request}
        )
        return Response(serializer.data)
