from django.db import models
from itm_common.models import APublishedModel, ASortPublishedModel, SortableMixin
from ckeditor.fields import RichTextField

from django.conf import settings
from .email_sender import notify_message
from datetime import datetime


class Team(ASortPublishedModel):
    title = models.CharField('Имя Фамилия', max_length=200)

    position = models.CharField('Должность', max_length=200)

    body = RichTextField('Текст')

    image_preview = models.FileField(verbose_name='Изображение (preview)', upload_to='team_img/')

    image = models.FileField(verbose_name='Изображение для страницы сотрудника', upload_to='team_img/', blank=True)

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
        verbose_name = 'Сотрудник фитнес-клуба'

        #: Название модели во множественном числе
        verbose_name_plural = 'Сотрудники фитнес-клуба'


class Workout(ASortPublishedModel):
    title = models.CharField('Заголовок', max_length=200)

    announcement = models.TextField('Анонс', blank=True)

    note = models.TextField('Примечание', blank=True)

    body = RichTextField('Текст')

    image_preview = models.FileField(verbose_name='Изображение (preview)', upload_to='workout_img/')

    image = models.FileField(verbose_name='Изображение для страницы тренировки', upload_to='workout_img/', blank=True)

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
        verbose_name = 'Тренировка'

        #: Название модели во множественном числе
        verbose_name_plural = 'Тренировки'


class ScheduleDirections(ASortPublishedModel):
    title = models.CharField('Название', max_length=200)

    # color = models.CharField('Цвет css', max_length=200, blank=True)

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
        verbose_name = 'Расписание - направление занятия'

        #: Название модели во множественном числе
        verbose_name_plural = 'Расписание - направления занятий'


class ScheduleClasses(ASortPublishedModel):
    title = models.CharField('Название', max_length=200)

    direction = models.ForeignKey(ScheduleDirections, verbose_name='Направление занятия', on_delete=models.CASCADE)

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
        verbose_name = 'Расписание - занятие'

        #: Название модели во множественном числе
        verbose_name_plural = 'Расписание - занятия'


class ScheduleInstructors(ASortPublishedModel):
    title = models.CharField('Название', max_length=200)

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
        verbose_name = 'Расписание - инструктор'

        #: Название модели во множественном числе
        verbose_name_plural = 'Расписание - инструкторы'


class ScheduleHall(ASortPublishedModel):
    title = models.CharField('Название', max_length=200)

    color = models.CharField('Цвет css', max_length=200, blank=True)

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
        verbose_name = 'Расписание - зал'

        #: Название модели во множественном числе
        verbose_name_plural = 'Расписание - залы'


class ScheduleTime(ASortPublishedModel):
    title = models.CharField('Время', max_length=200)

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
        verbose_name = 'Расписание - время'

        #: Название модели во множественном числе
        verbose_name_plural = 'Расписание - время'


class Schedule(ASortPublishedModel):

    classes = models.ForeignKey(ScheduleClasses, verbose_name='Занятие', on_delete=models.CASCADE)

    instructor = models.ForeignKey(ScheduleInstructors, verbose_name='Инструктор', on_delete=models.CASCADE)

    hall = models.ForeignKey(ScheduleHall, verbose_name='Зал', on_delete=models.CASCADE)

    date = models.DateField(verbose_name='Дата занятия')

    time = models.ForeignKey(ScheduleTime, verbose_name='Время занятия', on_delete=models.CASCADE, null=True)

    #: Метод для преобразования в строку
    def __str__(self):
        """
        Преобразование в строку
        """
        return self.classes.title + ' -- ' + self.instructor.title

    class Meta(ASortPublishedModel.Meta):
        """
        Класс мета-информации
        """

        #: Название модели
        verbose_name = 'Расписание'

        #: Название модели во множественном числе
        verbose_name_plural = 'Расписание'


class RequestViewFrm(models.Model):
    name = models.CharField('ФИО', max_length=200)

    phone = models.CharField('Телефон', max_length=200)

    created = models.DateTimeField('Дата создания', default=datetime.now, blank=True)

    def send_email(self, request):
        context = {'form': self, }

        notify_message(request,
                       'team/email_request/subject.txt',
                       'team/email_request/body.txt',
                       'team/email_request/body.html',
                       context, settings.EMAIL_HOST_USER_CONTACTS_FORM)

    #: Метод для преобразования в строку
    def __str__(self):
        """
        Преобразование в строку
        """
        if self.phone != "" and self.phone is not None:
            return self.phone
        else:
            return ""

    class Meta:
        """
        Класс мета-информации
        """

        #: Название модели
        verbose_name = 'Пользователь формы "Оставить заявку"'

        #: Название модели во множественном числе
        verbose_name_plural = 'Пользователи формы "Оставить заявку (стать тренером)"'
