from django.db import models

class PromotionSubscriber(models.Model):
    phone_number = models.CharField(max_length=20)
    consent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.phone_number