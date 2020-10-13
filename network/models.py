from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime

class User(AbstractUser):
    pass


class Tweet(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="twitter")
    content = models.CharField(max_length=500)
    date = models.DateTimeField(default=datetime.now())
    likes = models.ManyToManyField("User",blank=True, related_name="liked_by")

    def serialize(self):
        return {
            "user": self.user.id,
            "content": self.content,
            "date": self.date,
            "likes": [user.id for user in self.likes.all()]
        }

class Follow(models.Model):
    follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follower")
    following = models.ForeignKey("User", on_delete=models.CASCADE, related_name="following")
