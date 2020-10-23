from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime

class User(AbstractUser):
    followers =  models.ManyToManyField("User", blank=True, related_name="followed_by")
    following =  models.ManyToManyField("User", blank=True, related_name="following_others")


    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "followers": [follower.username for follower in self.followers.all()],
            "following": [following.username for following in self.following.all()]
            }


class Tweet(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="twitter")
    content = models.CharField(max_length=500)
    date = models.DateTimeField(default=datetime.now())
    likes = models.ManyToManyField("User",blank=True, related_name="liked_by")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user.id,
            "user": self.user.username,
            "content": self.content,
            "date": self.date,
            "likes": [user.id for user in self.likes.all()]
        }


