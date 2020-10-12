from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime

class User(AbstractUser):
    pass


class Tweet(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="twitter")
    content = models.CharField(max_length=500)
    date = models.DateTimeField(default=datetime.now())
    likes = models.ManyToManyField("User", related_name="likes")

    def sterilize(self):
        return {
            "user":self.user,
            "content":self.content,
            "date":self.date,
            "likes":self.likes
        }

class Follow(models.Model):
    follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follower")
    following = models.ForeignKey("User", on_delete=models.CASCADE, related_name="following")
