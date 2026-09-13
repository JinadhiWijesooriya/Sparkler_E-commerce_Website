from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock

from .models import Cart, CartItem, Country, CountryOrderSettings, Order
from shop.models import Product as ShopProduct

User = get_user_model()

class StripePaymentFlowTests(APITestCase):
    def setUp(self):
        # Create standard test data
        self.country = Country.objects.create(name="Sri Lanka")
        self.settings = CountryOrderSettings.objects.create(
            country=self.country,
            shipping_cost=1500.0,
            tax_rate=0.08,
            vat_rate=0.02
        )
        self.product = ShopProduct.objects.create(
            name="Golden Eternal Ring",
            price=250000.00,
            gem="Diamond",
            carat=1.5,
            metal="Gold",
            certification=True,
            availability=True
        )

    def test_checkout_fails_with_empty_cart(self):
        url = reverse("checkout")
        data = {
            "full_name": "Test User",
            "email": "test@example.com",
            "country": "Sri Lanka",
            "address_1": "123 Galle Road",
            "city": "Colombo",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Cart is empty")

    @patch("stripe.checkout.Session.create")
    def test_checkout_session_generation_success(self, mock_stripe_create):
        # 1. Add item to cart through active session
        cart_url = reverse("add-to-cart")
        cart_data = {
            "product_id": self.product.id,
            "quantity": 1,
            "source": "shop"
        }
        self.client.post(cart_url, cart_data, format="json")

        # 2. Mock Stripe session creation response
        mock_session = MagicMock()
        mock_session.url = "https://checkout.stripe.com/pay/test_session_id"
        mock_session.id = "cs_test_12345"
        mock_stripe_create.return_value = mock_session

        # 3. Post checkout shipping info
        checkout_url = reverse("checkout")
        checkout_data = {
            "full_name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "0771234567",
            "address_1": "456 Galle Road",
            "city": "Colombo",
            "country": "Sri Lanka",
            "postal_code": "00300"
        }
        response = self.client.post(checkout_url, checkout_data, format="json")

        # 4. Verify order creation and stripe invocation
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["checkout_url"], "https://checkout.stripe.com/pay/test_session_id")
        
        # Verify order exists in Database
        order_id = response.data["order_id"]
        order = Order.objects.get(order_id=order_id)
        self.assertEqual(order.status, "pending")
        self.assertEqual(order.full_name, "John Doe")
        self.assertEqual(order.total, 250000.00 + 1500.0 + (250000.00 * 0.08) + (250000.00 * 0.02))

        # Check Stripe mock properties
        mock_stripe_create.assert_called_once()
        args, kwargs = mock_stripe_create.call_args
        self.assertEqual(kwargs["payment_method_types"], ["card"])
        self.assertEqual(kwargs["mode"], "payment")
        self.assertEqual(kwargs["metadata"]["order_id"], order_id)

    @patch("stripe.checkout.Session.retrieve")
    @patch("cart.views.send_mail")
    def test_verify_payment_success(self, mock_send_mail, mock_stripe_retrieve):
        # 1. Prepare active cart and checkout a pending order
        # Set up a cart for the session
        session = self.client.session
        session['init'] = True
        session.save()
        
        cart = Cart.objects.create(session_key=session.session_key)
        CartItem.objects.create(cart=cart, product_shop=self.product, quantity=1)

        subtotal = 250000.00
        shipping_cost = 1500.0
        tax = subtotal * 0.08
        vat = subtotal * 0.02
        total = subtotal + shipping_cost + tax + vat

        order = Order.objects.create(
            cart=cart,
            full_name="John Doe",
            email="john.doe@example.com",
            address_1="456 Galle Road",
            city="Colombo",
            country=self.country,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            vat=vat,
            total=total,
            status="pending"
        )

        # 2. Mock Stripe session retrieve returning payment_status="paid"
        mock_session_obj = MagicMock()
        mock_session_obj.payment_status = "paid"
        mock_stripe_retrieve.return_value = mock_session_obj

        # 3. Post to verify payment
        verify_url = reverse("verify-payment", kwargs={"order_id": order.order_id})
        verify_data = {
            "session_id": "cs_test_12345"
        }
        response = self.client.post(verify_url, verify_data, format="json")

        # 4. Assert responses and state changes
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")

        # Re-fetch order and assert status is paid
        order.refresh_from_db()
        self.assertEqual(order.status, "paid")

        # Original cart items should be cleared
        self.assertEqual(cart.items.count(), 0)

        # Email should be sent
        mock_send_mail.assert_called_once()
        subject = mock_send_mail.call_args[1]["subject"]
        recipient_list = mock_send_mail.call_args[1]["recipient_list"]
        self.assertEqual(recipient_list, ["john.doe@example.com"])
        self.assertIn(order.order_id, subject)
