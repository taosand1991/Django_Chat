# Generated by Django 3.1.2 on 2020-10-05 19:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='thumbnail',
            field=models.ImageField(upload_to='profilePhoto/'),
        ),
    ]
