# Generated by Django 4.2.2 on 2023-09-14 09:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pieces', '0013_category_avg_difficulty_category_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='piece',
            name='sorting_title',
            field=models.CharField(default=1, max_length=150),
            preserve_default=False,
        ),
    ]