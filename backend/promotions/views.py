from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import PromotionSubscriberSerializer

@api_view(['POST'])
def subscribe(request):
    serializer = PromotionSubscriberSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Successfully subscribed!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)