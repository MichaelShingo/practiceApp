from django.db import models
from django.contrib.postgres.fields import ArrayField
from core.models import User
from django.utils import timezone


class Composer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    description = models.TextField()

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'
    

class Period(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()

class TypeOfPiece(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

class Technique(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    tutorial = models.URLField(blank=True)

class Category(models.Model):
    name = models.CharField(max_length=100)

    @property
    def avg_difficulty(self):
        queryset = Piece.objects.all()
        sum = 0
        count = 0
        for piece in queryset:
            if piece.category.id == self.id:
                sum += piece.difficulty
                count += 1
        
        return sum / count 
    
    @property
    def count(self):
        queryset = Piece.objects.filter(category__id=self.id)
        return len(queryset)
    
class Piece(models.Model):
    title = models.CharField(max_length=150)
    composer = models.ForeignKey(Composer, on_delete=models.CASCADE) # many-to-one - many pieces to one composer - a piece can have one composer - one composer can have many pieces
    period = models.ForeignKey(Period, on_delete=models.CASCADE) # many-to-one - many pieces to one period  - a piece can have one period - one period can have many pieces
    techniques = models.ManyToManyField(Technique) # many-to-many - one piece can have many techniques, one tecnique can have many pieces
    difficulty = models.IntegerField()
    prereqs = models.ManyToManyField('self', symmetrical=False) # one piece can have many prerequisites, each prereq can have many pieces
    recording_link = models.URLField(null=True, blank=True)
    tutorial_link = models.URLField(null=True, blank=True)
    type_of_piece = models.ForeignKey(TypeOfPiece, on_delete=models.CASCADE) # many-to-one - each piece can only have one type, each type can have many pieces
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)

    @property
    def sorting_title(self):
        start = -1
        end = -1
        for i, char in enumerate(self.title):
            if char.isdigit() and start == -1:
                start = i
            elif not char.isdigit() and start != -1:
                end = i
        if start == -1:
            return self.title
        
        if end == -1:
            end = len(self.title)

        slice = self.title[start:end]

        return str(len(slice)) + slice

class UserToPieces(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    piece = models.ForeignKey(Piece, on_delete=models.CASCADE)
    mastery_level = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
