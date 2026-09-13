from django.db import models

class SocialLink(models.Model):

    PLATFORM_CHOICES = [
        ("instagram", "Instagram"),
        ("facebook", "Facebook"),
        ("linkedin", "LinkedIn"),
        ("youtube", "YouTube"),
        ("tiktok", "TikTok"),
    ]

    name = models.CharField(
        max_length=20,
        choices=PLATFORM_CHOICES,
        unique=True
    )
    url = models.URLField()
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.get_name_display()
