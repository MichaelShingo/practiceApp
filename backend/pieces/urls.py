from django.urls import path 
from . import views

urlpatterns = [
    path('insert-composers/', views.insert_composer_view),
    path('composers/', views.composer_detail_view),
]