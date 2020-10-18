from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from .models import User, Tweet


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)['content']
    tweet = Tweet(
        user = request.user,
        content = data
    )
    tweet.save()

    return JsonResponse({"success": "Tweet made."}, status=201)

@csrf_exempt
@login_required
def tweets(request, page):
    # getting tweets accordingly
    if page == "all":
        tweets = Tweet.objects.all() 
    elif page == "profile_page":
        tweets = Tweet.objects.filter(
            user = request.user
        )
    elif page == "following_page":
        tweets = Tweet.objects.filter(user__in = request.user.following.all())
    else:
        return JsonResponse({"error": "Invalid request."}, status=400)

    # ordering the tweets
    tweets = tweets.order_by("-date").all()

    return JsonResponse([tweet.serialize() for tweet in tweets], safe=False)



@csrf_exempt
@login_required
def update(request, id):
    # querying for Tweet
    try:
        tweet = Tweet.objects.get(pk=id)
    except Tweet.DoesNotExist:
        return JsonResponse({"error": "Tweet does not exist"}, status=404)

    if request.method == 'PUT':
        data = json.loads(request.body)
        if data["content"] is not None:
            tweet.content = data["content"]
        elif data["like"] is not None:
            if request.user not in tweet.likes:
                tweet.likes.add(request.user)
            else:
                tweet.likes.remove(request.user)
        return JsonResponse({"error": "PUT method is none"})
    else:
        return JsonResponse({"error": "PUT method required"})

@csrf_exempt
@login_required
def follow(request, id):
    # getting the user
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)

    if request.method == "PUT":
        # checking if already followed
        if user in list(request.user.following.all()):
            request.user.following.remove(user)
        else:
            request.user.following.add(user)
    elif request.method == "GET":
        following = []
        followers = []
        for i in user.followers.all():
            followers.append(i.id)
        for i in user.following.all():
            following.append(i.id) 
        return JsonResponse({
            "followers": followers,
            "following": following
        })
    else:
        return JsonResponse({"error": "POST/GET method required"})




