from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Composer
from .serializers import (
    ComposerSerializer
)
import csv, os
from django.conf import settings
# Create your views here.


class InsertComposersAPIView(APIView):
    def get(self, request):
        serializer_class = ComposerSerializer
        print(settings.PROJECT_ROOT)
   
        with open(os.path.join(settings.BASE_DIR, 'composers.csv'), 'r') as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                entry = Composer(first_name=row[0], last_name=row[1])
                entry.save()
        
        file.close()
        status_code = status.HTTP_202_ACCEPTED
        return Response({}, status_code)

insert_composer_view = InsertComposersAPIView.as_view()

class ComposerDetailAPIView(APIView):
    def get(self, request):
        serializer_class = ComposerSerializer
        queryset = Composer.objects.all()
        serializer = ComposerSerializer(queryset, many=True)
        status_code = status.HTTP_200_OK
        return Response(serializer.data, status_code)
    
composer_detail_view = ComposerDetailAPIView.as_view()
    


    