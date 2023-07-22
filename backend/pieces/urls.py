from django.urls import path 
from . import views

urlpatterns = [
    path('insert-composers/', views.insert_composer_view),
    path('composers/', views.composer_detail_view),
    path('pieces/', views.pieces_detail_view),
    path('insert-pieces/', views.insert_pieces_view),
    # path('periods/', views.period_detail_view),
    path('insert-periods/', views.insert_periods_view),
    # path('types/', views.types_detail_view),
    path('insert-types/', views.insert_type_view),
    path('techniques/', views.techniques_view),
    path('insert-techniques/', views.insert_techniques_view),
    path('insert-categories/', views.insert_categories_view),
    path('user-piece/', views.user_piece_view),
    path('user-piece/<int:pk>/', views.user_piece_view),
    path('categories/', views.categories_view),
]