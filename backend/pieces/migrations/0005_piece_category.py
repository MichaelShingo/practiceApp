# Generated by Django 4.2.2 on 2023-06-28 09:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pieces', '0004_category_alter_piece_prereqs'),
    ]

    operations = [
        migrations.AddField(
            model_name='piece',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pieces.category'),
        ),
    ]
