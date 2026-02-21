from django.contrib import admin
from itm_common.admin import SortPublishedAdmin
from adminsortable.admin import SortableTabularInline
from .models import News, ImagesNews


class ImagesNewsInlineAdmin(SortableTabularInline):
    model = ImagesNews


class NewsAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']
    prepopulated_fields = {"slug": ("title",)}
    inlines = [
        ImagesNewsInlineAdmin,
    ]


class ImagesNewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'news', 'publicated']
    list_filter = ['news', ]


admin.site.register(News, NewsAdmin)
admin.site.register(ImagesNews, ImagesNewsAdmin)
