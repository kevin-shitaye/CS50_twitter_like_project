# Generated by Django 3.0.8 on 2020-10-13 11:58

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_follow_tweet'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tweet',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2020, 10, 13, 14, 58, 32, 263850)),
        ),
    ]