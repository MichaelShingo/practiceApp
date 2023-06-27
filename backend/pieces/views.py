from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import (
    Composer,
    Period,
    TypeOfPiece,
    Piece,
    Technique
)
from .serializers import (
    ComposerSerializer,
    PieceSerializer,
    TypeOfPieceSerializer,
    TechniqueSerializer,
    PeriodSerializer
)
import csv, os
from django.conf import settings
# Create your views here.

class PiecesDetailView(APIView):
    def get(self, request):
        serializer_class = PieceSerializer
        queryset = Piece.objects.all()
        serializer = PieceSerializer(queryset, many=True)
        status_code = status.HTTP_200_OK
        return Response(serializer.data, status_code)

pieces_detail_view = PiecesDetailView.as_view()

class ComposerDetailAPIView(APIView):
    def get(self, request):
        serializer_class = ComposerSerializer
        queryset = Composer.objects.all()
        serializer = ComposerSerializer(queryset, many=True)
        status_code = status.HTTP_200_OK
        return Response(serializer.data, status_code)
    
composer_detail_view = ComposerDetailAPIView.as_view()
    

class InsertComposersAPIView(APIView):
    def get(self, request):
        serializer_class = ComposerSerializer
        print(settings.PROJECT_ROOT)
   
        with open(os.path.join(settings.BASE_DIR, 'composers.csv'), 'r', encoding='UTF-8') as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                entry = Composer(first_name=row[0], last_name=row[1])
                entry.save()
        
        file.close()
        status_code = status.HTTP_202_ACCEPTED
        return Response({}, status_code)

insert_composer_view = InsertComposersAPIView.as_view()

class InsertPiecesAPIView(APIView):
    def get(self, request):
        serializer_class = PieceSerializer
   
        with open(os.path.join(settings.BASE_DIR, 'pieces.csv'), 'r', encoding='UTF-8') as file:
            csv_reader = csv.reader(file)
            
            for row in csv_reader:
                composer = Composer.objects.get(last_name=row[1])
                period = Period.objects.get(name=row[2])
                type_of_piece = TypeOfPiece.objects.get(name=row[9])
                
                entry = Piece(title=row[0], composer=composer, period=period, 
                              difficulty=int(row[4]), recording_link=row[6], type_of_piece=type_of_piece)
                entry.save()
                techniquesList = row[3].split(',')
                print(techniquesList)
                for techniqueStr in techniquesList:
                    try:
                        techniqueObj = Technique.objects.get(name=techniqueStr)
                        entry.techniques.add(techniqueObj)
                    except:
                        continue
     
        file.close()
        status_code = status.HTTP_202_ACCEPTED
        return Response({}, status_code)

insert_pieces_view = InsertPiecesAPIView.as_view()

class InsertPeriodsAPIView(APIView):
    def get(self, request):
        serializer_class = PeriodSerializer
   
        with open(os.path.join(settings.BASE_DIR, 'periods.csv'), 'r', encoding='UTF-8') as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                entry = Period(name=row[0])
                entry.save()
        
        file.close()
        status_code = status.HTTP_202_ACCEPTED
        return Response({}, status_code)

insert_periods_view = InsertPeriodsAPIView.as_view()


class InsertTypeOfPieceAPIView(APIView):
    def get(self, request):
        serializer_class = TypeOfPieceSerializer
   
        with open(os.path.join(settings.BASE_DIR, 'typeofpiece.csv'), 'r', encoding='UTF-8') as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                entry = TypeOfPiece(name=row[0])
                entry.save()
        
        file.close()
        status_code = status.HTTP_202_ACCEPTED
        return Response({}, status_code)

insert_type_view = InsertTypeOfPieceAPIView.as_view()

class InsertTechniquesAPIView(APIView):
    def get(self, request):
        serializer_class = TechniqueSerializer
   
        with open(os.path.join(settings.BASE_DIR, 'techniques.csv'), 'r', encoding='UTF-8') as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                entry = Technique(name=row[0], description=row[1], tutorial=row[2])
                entry.save()
        
        file.close()
        status_code = status.HTTP_202_ACCEPTED
        return Response({}, status_code)


insert_techniques_view = InsertTechniquesAPIView.as_view()







    