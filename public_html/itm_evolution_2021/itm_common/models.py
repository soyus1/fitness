from django.db import models
from datetime import datetime
from adminsortable.models import SortableMixin


class PublishedManager(models.Manager):
    """
    Менеджер (На основе стандартного) для работы с опубликованными материалами
    """
    def get_queryset(self):
        return super(PublishedManager, self).get_queryset().filter(publicated=True, pub_date__lt=datetime.now())


class APublishedModel(models.Model):
    """
    Стандартная абстрактная модель для описания менеджера с публикациями
    """

    objects = models.Manager()

    pub_objects = PublishedManager()

    publicated = models.BooleanField('Опубликовано', default=True)

    pub_date = models.DateTimeField('Дата публикации', default=datetime.now)

    class Meta:
        abstract = True


class ASortPublishedModel(SortableMixin):
    """
    Абстрактная модель с сортировкой для описания менеджера с публикациями
    """

    objects = models.Manager()

    pub_objects = PublishedManager()

    publicated = models.BooleanField('Опубликовано', default=True)

    pub_date = models.DateTimeField('Дата публикации', default=datetime.now)

    order = models.PositiveIntegerField('Вес', default=0, editable=False, db_index=True)

    class Meta:
        abstract = True

        ordering = ('order',)
