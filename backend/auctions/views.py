from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import AuctionItem, AuctionPageBackground, Bid
from .serializers import AuctionItemSerializer, AuctionPageBackgroundSerializer, BidSerializer

class AuctionItemViewSet(viewsets.ModelViewSet):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer

    @action(detail=True, methods=["POST"], permission_classes=[IsAuthenticated])
    def place_bid(self, request, pk=None):
        auction_item = self.get_object()
        user = request.user
        amount = request.data.get("amount")

        if not amount:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
        except ValueError:
            return Response({"error": "Amount must be a number"}, status=status.HTTP_400_BAD_REQUEST)

        # --- Check against current bid and starting price ---
        current_bid = float(auction_item.current_bid)
        starting_price = float(auction_item.starting_price)

        if current_bid == 0:
            # First bid must be at least starting_price
            if amount < starting_price:
                return Response(
                    {"error": f"First bid must be at least the starting price ({starting_price})"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Subsequent bids must be higher than current bid
            if amount <= current_bid:
                return Response(
                    {"error": f"Bid must be higher than current bid ({current_bid})"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # --- Check against ending price ---
        if auction_item.ending_price and amount > float(auction_item.ending_price):
            return Response(
                {"error": f"Bid cannot exceed the ending price ({auction_item.ending_price})"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Check bid increment ---
        increment = float(auction_item.bid_increment)
        # Bids must follow (starting_price + n * increment)
        # Using a small epsilon to avoid float precision issues
        if abs((amount - starting_price) % increment) > 0.01:
            return Response(
                {"error": f"Bid must be in increments of {increment} starting from {starting_price}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Create bid ---
        bid = Bid.objects.create(
            auction_item=auction_item,
            user=user,
            amount=amount
        )

        # --- Update current bid ---
        auction_item.current_bid = amount
        auction_item.save()

        return Response(BidSerializer(bid).data, status=status.HTTP_201_CREATED)
class AuctionPageBackgroundViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuctionPageBackground.objects.filter(is_active=True)
    serializer_class = AuctionPageBackgroundSerializer