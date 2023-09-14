from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from knox.auth import TokenAuthentication
import json

from .models import (
    Composer,
    Period,
    TypeOfPiece,
    Piece,
    Technique,
    Category,
    UserToPieces
)
from .serializers import (
    ComposerSerializer,
    PieceSerializer,
    TypeOfPieceSerializer,
    TechniqueSerializer,
    PeriodSerializer,
    CategorySerializer,
    UserToPiecesSerializer
)
import csv, os
from django.conf import settings


class CategoriesAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    def get(self, request):
        serializer_class = CategorySerializer
        
        queryset = Category.objects.all()
        serializer = CategorySerializer(queryset, many=True)

        return Response(serializer.data, status.HTTP_200_OK)
    
categories_view = CategoriesAPIView.as_view()


class PiecesDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    def get(self, request):
        serializer_class = PieceSerializer
        
        queryset = Piece.objects.all()
        serializer = PieceSerializer(queryset, many=True)
        status_code = status.HTTP_200_OK
        return Response(serializer.data, status_code)

pieces_detail_view = PiecesDetailView.as_view()

class PeriodDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    def get(self, request):
        serializer_class = PeriodSerializer
        queryset = Period.objects.all()
        serializer = PeriodSerializer(queryset, many=True)
        status_code = status.HTTP_200_OK
        return Response(serializer.data, status_code)

period_detail_view = PeriodDetailView.as_view()

class TypeDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    def get(self, request):
        serializer_class = TypeOfPieceSerializer
        queryset = TypeOfPiece.objects.all()
        serializer = TypeOfPieceSerializer(queryset, many=True)
        status_code = status.HTTP_200_OK
        return Response(serializer.data, status_code)

type_detail_view = TypeDetailView.as_view()

class UserPieceAPIView(APIView):
    serializer_class = UserToPiecesSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print(f' Current User = {user.first_name}')
        queryset = UserToPieces.objects.filter(user=user)
        serializer = UserToPiecesSerializer(queryset, many=True)
        status_code = status.HTTP_200_OK
        return Response(serializer.data, status_code)

    def post(self, request):
        try:
            user = request.user
            data = request.data
            mastery_level = data['mastery_level']
            piece = Piece.objects.get(id=data['piece'])
            instance = UserToPieces(user=user, piece=piece, mastery_level=mastery_level)
            instance.save()
            serializer = UserToPiecesSerializer(instance)
            return Response(data=json.dumps(serializer.data), status=status.HTTP_200_OK)

            
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, pk):
        try:
            query = UserToPieces.objects.get(id=pk)
            print(query)
        except UserToPieces.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserToPiecesSerializer(query, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    
    def delete(self, request):
        data = request.data
        user = request.user
        piece = Piece.objects.get(id=data['piece'])
        instance = UserToPieces.objects.get(user=user, piece=piece)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

user_piece_view = UserPieceAPIView.as_view()



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
                if not Composer.objects.filter(first_name=row[0], last_name=row[1]).exists():
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
                print(row[1])
                composer = Composer.objects.get(last_name=row[1])
                period = Period.objects.get(name=row[2])
                type_of_piece = TypeOfPiece.objects.get(name=row[9])
                category = Category.objects.get(name=row[10])
                difficulty = int(row[4])
                tutorial_link = row[5]
                recording_link = row[6]
                techniquesList = row[3].split(',')
                # print(category.name)
                try:
                    toUpdate = Piece.objects.get(composer__last_name=row[1], title=row[0], category=category)
                    toUpdate.period = period
                    toUpdate.difficulty = difficulty
                    toUpdate.recording_link = recording_link
                    toUpdate.tutorial_link = tutorial_link
                    toUpdate.type_of_piece = type_of_piece
                    toUpdate.category = category
                    toUpdate.save()
                    for techniqueStr in techniquesList:
                        try:
                            techniqueObj = Technique.objects.get(name=techniqueStr)
                            techniqueExists = toUpdate.techniques.filter(pk=techniqueObj.pk).exists()
                            print(techniqueObj.name, techniqueObj.pk, techniqueExists)
                            if not techniqueExists:
                                toUpdate.techniques.add(techniqueObj)
                        except:
                            continue
                except:
                    if not Piece.objects.filter(category=category, title=row[0]).exists():
                        entry = Piece(title=row[0], composer=composer, period=period, 
                                    difficulty=difficulty, recording_link=recording_link, 
                                    type_of_piece=type_of_piece, category=category,
                                    tutorial_link=tutorial_link)
                        entry.save()
                        
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

class InsertCategoriesAPIView(APIView):
    def get(self, request):
        serializer_class = CategorySerializer
   
        with open(os.path.join(settings.BASE_DIR, 'categories.csv'), 'r', encoding='UTF-8') as file:
            csv_reader = csv.reader(file)
            for row in csv_reader:
                if not Category.objects.filter(name=row[0]).exists():
                    entry = Category(name=row[0])
                    entry.save()
            
        file.close()
        status_code = status.HTTP_202_ACCEPTED
        return Response({}, status_code)

insert_categories_view = InsertCategoriesAPIView.as_view()


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

class TechniquesAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    def get(self, request):
        serializer_class = TechniqueSerializer
        
        queryset = Technique.objects.all().order_by('name')
        serializer = TechniqueSerializer(queryset, many=True)

        return Response(serializer.data, status.HTTP_200_OK)
    
techniques_view = TechniquesAPIView.as_view()







    