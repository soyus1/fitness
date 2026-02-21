from django.contrib import admin
from django.urls import reverse

from itm_common.admin import PublishedAdmin

from .models import Page, HTMLBlock, TextBlock, StringBlock, ImageBlock, MetaData, SliderBlock, SliderBlockSlide

from adminsortable.admin import SortableAdmin, SortableTabularInline


class PageAdmin(PublishedAdmin):
    prepopulated_fields = {'slug': ('title',)}

    def view_on_site(self, obj):
        return reverse('itm_main:page', args=(obj.slug, ))


class HTMLBlockAdmin(admin.ModelAdmin):
    list_display = ['id', 'token']


class SliderBlockSlideAdmin(admin.TabularInline):
    model = SliderBlockSlide


class SliderBlockAdmin(SortableAdmin):
    inlines = [
        SliderBlockSlideAdmin,
    ]


admin.site.register(Page, PageAdmin)

admin.site.register(HTMLBlock, HTMLBlockAdmin)
admin.site.register(TextBlock)
admin.site.register(StringBlock)
admin.site.register(ImageBlock)

admin.site.register(MetaData)
admin.site.register(SliderBlock, SliderBlockAdmin)
admin.site.register(SliderBlockSlide, SortableAdmin)
