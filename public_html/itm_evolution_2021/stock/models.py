from django.db import models
from itm_common.models import APublishedModel, ASortPublishedModel, SortableMixin
from ckeditor.fields import RichTextField


# Create your models here.
class Stock(ASortPublishedModel):
    title = models.TextField('Заголовок', max_length=200)

    announcement = RichTextField('Анонс', blank=True)

    body = RichTextField('Текст')

    image_preview = models.FileField(verbose_name='Изображение (preview)', upload_to='stock_img/')

    image = models.FileField(verbose_name='Изображение для страницы акции', upload_to='stock_img/', blank=True)

    slug = models.SlugField('Ссылка', unique=True)

    #: Метод для преобразования в строку
    def __str__(self):
        """
        Преобразование в строку
        """
        return self.title

    class Meta(ASortPublishedModel.Meta):
        """
        Класс мета-информации
        """

        #: Название модели
        verbose_name = 'Акция'

        #: Название модели во множественном числе
        verbose_name_plural = 'Акции'
