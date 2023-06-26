from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TechniquesViewSet

router = DefaultRouter() # automatically generates url patterns for the viewset
router.register('techniques', TechniquesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]