from django.db import models
from django.contrib.postgres.fields import ArrayField

class Composer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'
    

class Period(models.Model):
    name = models.CharField(max_length=50)

class TypeOfPiece(models.Model):
    name = models.CharField(max_length=100)

class Technique(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    tutorial = models.URLField(blank=True)

# add techniques here too

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

    
