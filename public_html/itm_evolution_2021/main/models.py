from django.db import models
from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField
from django.urls import reverse
from itm_common.models import APublishedModel, SortableMixin, ASortPublishedModel
from adminsortable.models import SortableForeignKey


# Create your models here.
class Slide(ASortPublishedModel):
    title = models.CharField('Заголовок', max_length=200)

    subtitle = RichTextUploadingField('Текст')

    image = models.FileField(verbose_name='Изображение', upload_to='slide_main_img/')

    image_mobile = models.FileField(verbose_name='Изображение для мобильной версии', upload_to='slide_main_img/')

    link = models.CharField('Ссылка', max_length=200)

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
        verbose_name = 'Слайд для главной страницы'

        #: Название модели во множественном числе
        verbose_name_plural = 'Слайды для главной страницы'


class SocialLinks(ASortPublishedModel):
    title = models.CharField('Заголовок', max_length=200)

    image = models.FileField(verbose_name='Изображение', upload_to='social_link_img/')

    link = models.CharField('Ссылка', max_length=200)

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
        verbose_name = 'Социальная сеть'

        #: Название модели во множественном числе
        verbose_name_plural = 'Социальные сети'


class Characteristics(ASortPublishedModel):
    title = models.TextField('Заголовок', max_length=200)

    image = models.FileField(verbose_name='Изображение', upload_to='characteristics_img/')

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
        verbose_name = 'Характеристика'

        #: Название модели во множественном числе
        verbose_name_plural = 'Характеристики'


class Benefits(ASortPublishedModel):
    title = models.TextField('Заголовок', max_length=200)

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
        verbose_name = 'Преимущество'

        #: Название модели во множественном числе
        verbose_name_plural = 'Преимущества'
