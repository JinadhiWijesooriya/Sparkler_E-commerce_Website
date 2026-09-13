from django.db import models

class HeroSection(models.Model):
    badge_text = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    subtitle = models.TextField()
    background_image = models.ImageField(upload_to='hero/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Service(models.Model):
    ICON_CHOICES = [
        ('wrench', 'Wrench'),
        ('diamond', 'Diamond'),
        ('watch', 'Watch'),
        ('zap', 'Zap'),
        ('edit', 'Edit'),
    ]
    title = models.CharField(max_length=200)
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default='wrench')
    description = models.TextField()
    estimated_cost = models.CharField(max_length=100)
    video = models.FileField(upload_to='service_videos/', blank=True, null=True)  # upload video

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


# New model to store multiple images per service
class ServiceImage(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='service_images/')
    is_before = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.service.title} - {'Before' if self.is_before else 'After'}"
