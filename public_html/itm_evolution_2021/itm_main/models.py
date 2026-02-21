from django.db import models
from ckeditor.fields import RichTextField

from django.urls import reverse

from itm_common.models import APublishedModel, SortableMixin

from adminsortable.models import SortableForeignKey


class Page(APublishedModel):
    title = models.CharField('Заголовок', max_length=100)

    body = RichTextField('Тело')

    slug = models.SlugField('Ссылка', unique=True)

    #: Метод для преобразования в строку
    def __str__(self):
        """
        Преобразование в строку
        """
        return self.title

    class Meta(APublishedModel.Meta):
        """
        Класс мета-информации
        """

        #: Название модели
        verbose_name = 'Страница'

        #: Название модели во множественном числе
        verbose_name_plural = 'Страницы'


class MetaData(models.Model):
    title = models.CharField('Тэг title', max_length=255)

    description = models.TextField('Тэг description')

    keywords = models.TextField('Тэг keywords')

    link = models.CharField('Относительный URL', max_length=255, unique=True)

    #: Метод для преобразования в строку
    def __str__(self):
        """
        Преобразование в строку
        """
        return self.title

    class Meta:
        """
        Класс мета-информации
        """

        #: Название модели
        verbose_name = 'Метатэг'

        verbose_name_plural = 'Метатэги'


class Block(models.Model):
    token = models.CharField('Токен', max_length=200, unique=True)

    #: Метод для преобразования в строку
    def __str__(self):
        """
        Преобразование в строку
        """
        return self.token

    class Meta:
        abstract = True


class HTMLBlock(Block):
    value = RichTextField('Значение')

    def admin_change_path(self):
        return reverse('admin:itm_main_htmlblock_change', args=(self.id, ))

    class Meta:
        """
        Класс мета-информации
        """

        #: Название модели
        verbose_name = 'HTML Блок'

        #: Название модели во множественном числе
        verbose_name_plural = 'HTML Блоки'


class TextBlock(Block):
    value = models.TextField('Значение')

    def admin_change_path(self):
        return reverse('admin:itm_main_textblock_change', args=(self.id, ))

    class Meta:
        """
        Класс мета-информации
        """

        #: Название модели
        verbose_name = 'Text Блок'

        #: Название модели во множественном числе
        verbose_name_plural = 'Text Блоки'


class StringBlock(Block):
    value = models.CharField('Значение', max_length=200)

    def admin_change_path(self):
        return reverse('admin:itm_main_stringblock_change', args=(self.id, ))

    class Meta:
        """
        Класс мета-информации
        """

        #: Название модели
        verbose_name = 'String Блок'

        #: Название модели во множественном числе
        verbose_name_plural = 'String Блоки'


class ImageBlock(Block):
    value = models.ImageField('Изображение', upload_to='block/images/')

    width = models.CharField('Ширина', max_length=200, blank=True)

    height = models.CharField('Высота', max_length=200, blank=True)

    def admin_change_path(self):
        return reverse('admin:itm_main_imageblock_change', args=(self.id, ))

    class Meta:
        """
        Класс мета-информации
        """

        #: Название модели
        verbose_name = 'Image Блок'

        #: Название модели во множественном числе
        verbose_name_plural = 'Image Блоки'


class SliderBlock(Block, SortableMixin):

    order = models.PositiveIntegerField('Вес', default=0, editable=False, db_index=True)

    class Meta:
        """
        Класс мета-информации
        """
        ordering = ('order',)

        #: Название модели
        verbose_name = 'Слайдер изображений'

        #: Название модели во множественном числе
        verbose_name_plural = 'Слайдеры изображений'


class SliderBlockSlide(SortableMixin):
    block = SortableForeignKey(SliderBlock, verbose_name='Слайдер', on_delete=models.CASCADE)

    image = models.ImageField('Изображение', upload_to='slider_block/images/')

    order = models.PositiveIntegerField('Вес', default=0, editable=False, db_index=True)

    class Meta:
        """
        Класс мета-информации
        """
        ordering = ('order',)

        #: Название модели
        verbose_name = 'Слайд'

        #: Название модели во множественном числе
        verbose_name_plural = 'Слайды'
