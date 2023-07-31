from rest_framework import serializers
from .models import (
    Composer,
    Period,
    TypeOfPiece,
    Technique,
    Piece,
    Category,
    UserToPieces
)

class ComposerSerializer(serializers.ModelSerializer): # get full name
    class Meta:
        model = Composer
        full_name = serializers.SerializerMethodField()
        fields = [
            'first_name',
            'last_name',
            'full_name',
            'description',
        ]
    
    def get_full_name(self, instance):
        return instance.full_name

class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = [
            'id',
            'name',
            'description',
        ]

class TypeOfPieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOfPiece
        fields = [
            'name'
            'description',
        ]

class TechniqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technique
        fields = [
            'id',
            'name',
            'description',
            'tutorial'
        ]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id',
            'name'
        ]

class PieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Piece
        depth = 1
        composer = ComposerSerializer(read_only=True, source='composer')
        fields = [
            'id',
            'category',
            'title',
            'composer',
            'period',
            'techniques',
            'difficulty',
            'prereqs',
            'recording_link',
            'tutorial_link',
            'type_of_piece'
        ]

class UserToPiecesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserToPieces
        depth = 1
        fields = [
            'id',
            'user',
            'piece',
            'mastery_level',
        ]
