from rest_framework import serializers
from .models import (
    Composer,
    Period,
    TypeOfPiece,
    Technique,
    Piece
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

class PieceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Piece
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