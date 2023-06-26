from rest_framework import viewsets
from .models import Techniques
from .serializers import TechniquesSerializer
from rest_framework import generics, permissions


class TechniquesViewSet(viewsets.ModelViewSet):
    # automatically provides CRUD functionality
    permission_classes = [permissions.IsAuthenticated]
    queryset = Techniques.objects.all()
    serializer_class = TechniquesSerializer