from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt import views as jwt_views
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response



urlpatterns = [
    path('register/', views.registration_view),
    path('login/', views.login_view),
    path('logout/', views.logout_view),
    path('change-password/', views.change_password_view),
    path('token-refresh/', jwt_views.TokenRefreshView.as_view()),

]