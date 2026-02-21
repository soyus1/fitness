from django.db import models
from itm_common.models import APublishedModel, ASortPublishedModel, SortableMixin
from ckeditor.fields import RichTextField


# Create your models here.
class News(ASortPublishedModel):
    title = models.TextField('Заголовок', max_length=200)

    announcement = RichTextField('Анонс', blank=True)

    body = RichTextField('Текст')

    image_preview = models.FileField(verbose_name='Изображение (preview)', upload_to='news_img/')

    image = models.FileField(verbose_name='Изображение для страницы новости', upload_to='news_img/', blank=True)

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
        verbose_name = 'Новость'

        #: Название модели во множественном числе
        verbose_name_plural = 'Новости'


class ImagesNews(ASortPublishedModel):
    title = models.CharField(max_length=200, db_index=True, verbose_name="Название")

    news = models.ForeignKey(News, verbose_name="Новость", on_delete=models.CASCADE)

    image_preview = models.ImageField(verbose_name='Изображение (preview)', null=True, blank=True,
                                      upload_to='news_img/')

    image = models.ImageField(verbose_name='Изображение', upload_to='news_img/')

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
        verbose_name = 'Изображение для новости/статьи'

        #: Название модели во множественном числе
        verbose_name_plural = 'Изображения для новости/статьи'
