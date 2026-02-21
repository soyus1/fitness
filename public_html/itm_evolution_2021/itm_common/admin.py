from django.contrib import admin
from adminsortable.admin import SortableAdmin


def set_custom_fieldsets(fieldsets):
    """
    Функция для распознавания и добавления списка с полями в наследуемых классах
    :param fieldsets: Список fieldset
    :return: Нет значения. Просто добавляет в массив все что нужно
    """
    fields = fieldsets[0][1]['fields']
    if ('pub_date' in fields) and ('publicated' in fields):
        fields.remove('pub_date')
        fields.remove('publicated')

        fieldsets.append(('Опции публикации', {
            'fields': ('publicated', 'pub_date',)
        }))


class PublishedAdmin(admin.ModelAdmin):
    """
    Класс для отображения в админке параметров публикации с fieldsets
    """
    def get_fieldsets(self, request, obj=None):
        fieldsets = super(PublishedAdmin, self).get_fieldsets(request, obj)

        set_custom_fieldsets(fieldsets)

        return fieldsets


class SortPublishedAdmin(SortableAdmin):
    """
    Класс для отображения в админке параметров публикации с fieldsets (С сортировкой)
    """
    def get_fieldsets(self, request, obj=None):
        fieldsets = super(SortPublishedAdmin, self).get_fieldsets(request, obj)

        set_custom_fieldsets(fieldsets)

        return fieldsets
