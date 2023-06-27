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
    # path('techniques/', views.techniques_detail_view),
    path('insert-techniques/', views.insert_techniques_view),
]