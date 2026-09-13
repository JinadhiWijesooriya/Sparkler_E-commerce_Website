from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings as django_settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Cart, CartItem, Country, Order
from shop.models import Product as ShopProduct
from shop_sets.models import Product as SetsProduct
from gems.models import Gem

from django.db import transaction
from .serializers import CartSerializer, CountrySerializer, OrderSerializer

import stripe

# -------------------------
# HELPER: GET ACTIVE CART
# -------------------------
def get_active_cart(request):
    if not request.session.session_key:
        request.session.create()

    cart = (
        Cart.objects
        .filter(session_key=request.session.session_key, orders__isnull=True)
        .order_by("-created_at")
        .first()
    )

    if not cart:
        cart = Cart.objects.create(
            session_key=request.session.session_key,
            user=request.user if request.user.is_authenticated else None,
        )

    return cart


# -------------------------
# CART
# -------------------------
class CartAPIView(APIView):
    def get(self, request):
        cart = get_active_cart(request)
        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data)


class AddToCartAPIView(APIView):
    def post(self, request):
        cart = get_active_cart(request)

        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))
        source = request.data.get("source")  # "shop" | "set"

        if source == "shop":
            product = ShopProduct.objects.filter(id=product_id).first()
            if not product:
                return Response({"error": "Product not found"}, status=404)

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product_shop=product,
                defaults={"quantity": 0},
            )

        elif source == "set":
            product = SetsProduct.objects.filter(id=product_id).first()
            if not product:
                return Response({"error": "Product not found"}, status=404)

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product_set=product,
                defaults={"quantity": 0},
            )

        elif source == "gem":
            product = Gem.objects.filter(id=product_id).first()
            if not product:
                return Response({"error": "Gem not found"}, status=404)

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product_gem=product,
                defaults={"quantity": 0},
            )

        else:
            return Response({"error": "Invalid source"}, status=400)

        cart_item.quantity += quantity
        cart_item.save()

        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data)


class UpdateCartItemAPIView(APIView):
    def post(self, request, pk):
        cart_item = CartItem.objects.filter(id=pk).first()
        if not cart_item:
            return Response({"error": "Cart item not found"}, status=404)

        quantity = int(request.data.get("quantity", 1))

        if quantity < 1:
            cart_item.delete()
        else:
            cart_item.quantity = quantity
            cart_item.save()

        serializer = CartSerializer(cart_item.cart, context={"request": request})
        return Response(serializer.data)


class RemoveCartItemAPIView(APIView):
    def delete(self, request, pk):
        cart_item = CartItem.objects.filter(id=pk).first()
        if cart_item:
            cart_item.delete()

        cart = get_active_cart(request)
        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data)


# -------------------------
# EMAIL HELPER
# -------------------------
def send_order_email(order):
    tracking_url = f"{django_settings.FRONTEND_URL}/tracking/{order.order_id}"
    subject = f"Your Sparkler Order Confirmation – #{order.order_id}"
    plain_message = (
        f"Hi {order.full_name},\n\n"
        f"Thank you for your order at Sparkler Jewelry! 💎\n\n"
        f"Your Order ID: {order.order_id}\n"
        f"Status: {order.status.capitalize()}\n\n"
        f"You can track your order anytime here:\n"
        f"{tracking_url}\n\n"
        f"We'll update you as your order progresses.\n\n"
        f"Warm regards,\n"
        f"The Sparkler Team"
    )
    item_rows_html = ""
    if order.cart:
        for item in order.cart.items.all():
            item_rows_html += f"""
            <tr>
              <td style="color:#EDEDED;font-size:14px;padding:8px 0;border-bottom:1px solid #C9A24D22;">{item.name}</td>
              <td style="color:#888;font-size:14px;text-align:center;padding:8px 0;border-bottom:1px solid #C9A24D22;">x{item.quantity}</td>
              <td style="color:#EDEDED;font-size:14px;text-align:right;padding:8px 0;border-bottom:1px solid #C9A24D22;">LKR {item.total_price:,.2f}</td>
            </tr>
            """

    html_message = f"""
    <html>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:16px;overflow:hidden;border:1px solid #C9A24D33;">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%);padding:40px 40px 30px;text-align:center;border-bottom:1px solid #C9A24D33;">
                    <h1 style="margin:0;font-size:28px;font-weight:700;color:#C9A24D;letter-spacing:3px;text-transform:uppercase;">✦ Sparkler</h1>
                    <p style="margin:8px 0 0;color:#888;font-size:13px;letter-spacing:1px;">Luxury Jewelry</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 8px;font-size:22px;color:#EDEDED;">Order Confirmed! 🎉</h2>
                    <p style="margin:0 0 24px;color:#888;font-size:15px;">Hi {order.full_name}, thank you for shopping with us.</p>

                    <!-- Order Items Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #C9A24D22;margin-bottom:20px;">
                      <tr>
                        <td style="padding:24px;">
                          <h3 style="margin:0 0 16px;color:#C9A24D;font-size:16px;">Order Items</h3>
                          <table width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <th align="left" style="color:#888;font-size:12px;padding-bottom:12px;border-bottom:1px solid #C9A24D22;">ITEM</th>
                              <th align="center" style="color:#888;font-size:12px;padding-bottom:12px;border-bottom:1px solid #C9A24D22;">QTY</th>
                              <th align="right" style="color:#888;font-size:12px;padding-bottom:12px;border-bottom:1px solid #C9A24D22;">PRICE</th>
                            </tr>
                            {item_rows_html}
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Order Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #C9A24D22;margin-bottom:28px;">
                      <tr>
                        <td style="padding:24px;">
                          <table width="100%">
                            <tr>
                              <td style="color:#888;font-size:13px;padding-bottom:8px;">ORDER ID</td>
                              <td style="color:#C9A24D;font-size:13px;font-weight:700;font-family:monospace;text-align:right;padding-bottom:8px;">{order.order_id}</td>
                            </tr>
                            <tr>
                              <td style="color:#888;font-size:13px;padding-bottom:8px;">STATUS</td>
                              <td style="text-align:right;padding-bottom:8px;"><span style="background:#C9A24D22;color:#C9A24D;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;">{order.status.upper()}</span></td>
                            </tr>
                            <tr>
                              <td style="color:#888;font-size:13px;">SUBTOTAL</td>
                              <td style="color:#EDEDED;font-size:14px;font-weight:500;text-align:right;">LKR {order.subtotal:,.2f}</td>
                            </tr>
                            <tr>
                              <td style="color:#888;font-size:13px;">SHIPPING</td>
                              <td style="color:#EDEDED;font-size:14px;font-weight:500;text-align:right;">LKR {order.shipping_cost:,.2f}</td>
                            </tr>
                            <tr>
                              <td style="color:#888;font-size:13px;padding-bottom:12px;">TAX & VAT</td>
                              <td style="color:#EDEDED;font-size:14px;font-weight:500;text-align:right;padding-bottom:12px;">LKR {(order.tax + order.vat):,.2f}</td>
                            </tr>
                            <tr>
                              <td style="color:#888;font-size:13px;border-top:1px solid #C9A24D22;padding-top:12px;">TOTAL</td>
                              <td style="color:#EDEDED;font-size:16px;font-weight:700;text-align:right;border-top:1px solid #C9A24D22;padding-top:12px;">LKR {order.total:,.2f}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Track Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="{tracking_url}" style="display:inline-block;background:linear-gradient(135deg,#C9A24D,#B08B3E);color:#0a0a0a;font-size:15px;font-weight:700;padding:14px 40px;border-radius:50px;text-decoration:none;letter-spacing:0.5px;">Track My Order →</a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:28px 0 0;color:#555;font-size:12px;text-align:center;">Or copy this link: <a href="{tracking_url}" style="color:#C9A24D;text-decoration:none;">{tracking_url}</a></p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background:#0d0d0d;padding:24px 40px;text-align:center;border-top:1px solid #C9A24D22;">
                    <p style="margin:0;color:#444;font-size:12px;">© Sparkler Jewelry · All rights reserved</p>
                    <p style="margin:6px 0 0;color:#333;font-size:11px;">Questions? Contact our support team.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=django_settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.email],
            html_message=html_message,
            fail_silently=False,
        )
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send tracking email to {order.email}: {e}")


# -------------------------
# CHECKOUT 
# -------------------------
class CheckoutAPIView(APIView):
    @transaction.atomic
    def post(self, request):
        original_cart = get_active_cart(request)

        if not original_cart.items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        data = request.data

        # -------------------------
        # CLONE CART FOR ORDER
        # -------------------------
        order_cart = Cart.objects.create(
            user=request.user if request.user.is_authenticated else None,
            session_key=request.session.session_key,  
        )

        for item in original_cart.items.all():
            CartItem.objects.create(
                cart=order_cart,
                product_shop=item.product_shop,
                product_set=item.product_set,
                product_gem=item.product_gem,
                quantity=item.quantity,
            )

        # -------------------------
        # CALCULATE TOTALS
        # -------------------------
        subtotal = sum(item.total_price for item in order_cart.items.all())

        country = Country.objects.filter(name=data.get("country")).first()
        settings = getattr(country, "order_settings", None)

        shipping_cost = settings.shipping_cost if settings else 0
        tax_rate = settings.tax_rate if settings else 0.07
        vat_rate = settings.vat_rate if settings else 0

        tax = subtotal * tax_rate
        vat = subtotal * vat_rate
        total = subtotal + shipping_cost + tax + vat

        # -------------------------
        # CREATE ORDER (Initially pending)
        # -------------------------
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            cart=order_cart,

            full_name=data["full_name"],
            email=data["email"],
            phone=data.get("phone"),

            address_1=data["address_1"],
            address_2=data.get("address_2", ""),
            city=data["city"],
            state=data.get("state", ""),
            country=country,
            postal_code=data.get("postal_code", ""),

            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            vat=vat,
            total=total,

            status="pending",
            payment_method=data.get("payment_method", "card"),
            created_at=timezone.localtime(timezone.now())
        )

        if order.payment_method == "cod":
            # Just clear the original cart, since COD payment happens on delivery
            original_cart.items.all().delete()
            
            # Send confirmation email
            # We can mark it as processing or leave it pending, but we should notify users
            order.status = "processing"
            order.save()
            send_order_email(order)
            
            return Response({
                "checkout_url": f"{django_settings.FRONTEND_URL}/payment-success/{order.order_id}?session_id=cod",
                "order_id": order.order_id
            }, status=201)

        # -------------------------
        # STRIPE CHECKOUT SESSION PREPARATION
        # -------------------------
        stripe.api_key = django_settings.STRIPE_SECRET_KEY
        try:
            line_items = []
            
            # Add cart items
            for item in order_cart.items.all():
                line_items.append({
                    'price_data': {
                        'currency': 'lkr',
                        'product_data': {
                            'name': item.name,
                        },
                        'unit_amount': int(item.price * 100),
                    },
                    'quantity': item.quantity,
                })
            
            # Shipping, tax, vat as line items
            if shipping_cost > 0:
                line_items.append({
                    'price_data': {
                        'currency': 'lkr',
                        'product_data': {
                            'name': 'Shipping Cost',
                        },
                        'unit_amount': int(shipping_cost * 100),
                    },
                    'quantity': 1,
                })
            
            if (tax + vat) > 0:
                line_items.append({
                    'price_data': {
                        'currency': 'lkr',
                        'product_data': {
                            'name': 'Taxes & VAT',
                        },
                        'unit_amount': int((tax + vat) * 100),
                    },
                    'quantity': 1,
                })

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                invoice_creation={"enabled": True},
                success_url=f"{django_settings.FRONTEND_URL}/payment-success/{order.order_id}?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{django_settings.FRONTEND_URL}/cart?payment_canceled=true",
                metadata={
                    'order_id': order.order_id,
                }
            )

            # Return Checkout URL
            return Response({
                "checkout_url": checkout_session.url,
                "order_id": order.order_id
            }, status=201)

        except Exception as e:
            # Clean up the pending order inside transaction if session creation fails
            order.delete()
            print(f"[STRIPE ERROR] Failed to create checkout session: {e}")
            return Response({"error": f"Failed to generate checkout session: {str(e)}"}, status=500)


# -------------------------
# VERIFY PAYMENT
# -------------------------
class VerifyPaymentAPIView(APIView):
    def post(self, request, order_id):
        session_id = request.data.get("session_id")
        if not session_id:
            return Response({"error": "Session ID is required"}, status=400)

        order = Order.objects.filter(order_id=order_id).first()
        if not order:
            return Response({"error": "Order not found"}, status=404)

        if order.status == "paid":
            return Response({"status": "success", "message": "Already paid"}, status=200)
            
        if session_id == "cod" and order.payment_method == "cod":
            return Response({"status": "success", "message": "Order placed successfully"}, status=200)

        # Verify backend with Stripe
        stripe.api_key = django_settings.STRIPE_SECRET_KEY
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == 'paid':
                # Mark as Paid
                order.status = "paid"
                order.save()

                # Clear original shopping cart
                if order.cart:
                    order.cart.items.all().delete()
                original_cart = get_active_cart(request)
                original_cart.items.all().delete()

                # Send confirmation email
                send_order_email(order)

                return Response({"status": "success", "message": "Payment verified successfully!"}, status=200)
            else:
                return Response({"error": "Payment has not been completed"}, status=400)
        except Exception as e:
            return Response({"error": f"Failed to verify payment with Stripe: {str(e)}"}, status=500)


# -------------------------
# COUNTRIES & ORDERS
# -------------------------
class CountriesAPIView(APIView):
    def get(self, request):
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)


class OrderDetailAPIView(APIView):
    def get(self, request, order_id):
        order = Order.objects.filter(order_id=order_id).first()
        if not order:
            return Response({"error": "Order not found"}, status=404)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


class PendingOrdersAPIView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            orders = Order.objects.filter(user=request.user, status="pending")
        else:
            orders = Order.objects.filter(
                cart__session_key=request.session.session_key,
                status="pending",
            )
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class AllOrdersAPIView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            orders = Order.objects.filter(user=request.user)
        else:
            orders = Order.objects.filter(
                cart__session_key=request.session.session_key
            )
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
