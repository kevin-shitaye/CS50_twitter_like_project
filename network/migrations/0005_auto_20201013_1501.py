# Generated by Django 3.0.8 on 2020-10-13 12:01

import datetime
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_auto_20201013_1459'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tweet',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2020, 10, 13, 15, 1, 30, 272401)),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='liked_by', to=settings.AUTH_USER_MODEL),
        ),
    ]