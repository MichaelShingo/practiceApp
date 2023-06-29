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
        ]
    
    def get_full_name(self, instance):
        return instance.full_name

class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = [
            'name'
        ]

class TypeOfPieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOfPiece
        fields = [
            'name'
        ]

class TechniqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technique
        fields = [
            'name',
            'description',
            'tutorial'
        ]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'name'
        ]

class PieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Piece
        depth = 1
        fields = [
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
    model = UserToPieces
    fields = [
        'user',
        'piece',
        'mastery_level',
    ]
