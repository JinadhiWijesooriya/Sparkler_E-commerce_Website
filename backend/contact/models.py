from django.db import models

# ---------------- CONTACT INFO ----------------
class ContactInfo(models.Model):
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    address = models.CharField(max_length=300)

    def __str__(self):
        return f"{self.email} | {self.phone}"

# ---------------- HERO SECTION ----------------
class ContactHero(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField()
    background_image = models.ImageField(upload_to='contact_hero/')
    map_url = models.TextField(blank=True, null=True)
 

    def __str__(self):
        return self.title

# ---------------- CONTACT MESSAGE ----------------
class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.email}"
