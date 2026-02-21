from django.contrib import admin
from itm_common.admin import SortPublishedAdmin
from adminsortable.admin import SortableTabularInline
from .models import Stock


class StockAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']
    prepopulated_fields = {"slug": ("title",)}


admin.site.register(Stock, StockAdmin)
