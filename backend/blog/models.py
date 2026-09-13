from django.db import models

# ================= HERO SECTION =================
class HeroSection(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField()
    image = models.ImageField(upload_to="hero_images/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# ================= BLOG ARTICLES =================
class Article(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField()
    content = models.TextField()  # full content for blog-detail page
    featured_image = models.ImageField(upload_to="blog_images/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ArticleImage(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="blog_images/")
    caption = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.article.title} Image"
