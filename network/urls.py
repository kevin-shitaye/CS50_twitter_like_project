
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("tweet/<str:page>", views.tweets, name="tweets"),
    path("post", views.post, name="post"),
    path("update/<int:id>", views.update, name="update"),
    path("follow/<int:id>", views.follow, name="follow"),
    path("tweetsOf/<int:id>", views.tweets_of, name="tweetsOf")
]
