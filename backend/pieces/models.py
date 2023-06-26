from django.db import models
from django.contrib.postgres.fields import ArrayField

class Composers(models.Model):
    name = models.CharField(max_length=100)

class Period(models.Model):
    name = models.CharField(max_length=50)

class TypeOfPiece(models.Model):
    name = models.CharField(max_length=100)



# add techniques here too

class Pieces(models.Model):
    title = models.CharField(max_length=150)
    composer = models.CharField(max_length=150)
    period = models.CharField(max_length=50)
    # techniques = ArrayField(models.ForeignKey())
    difficulty = models.IntegerField()
    prereqs = ArrayField(models.ForeignKey('self'))
    recording_link = models.URLField(null=True, blank=True)
    tutorial_link = models.URLField(null=True, blank=True)
    type_of_piece = models.CharField(max_length=50)
    
