from django.contrib import admin
from django.urls import reverse

from .models import Slide, SocialLinks, Characteristics, Benefits
from itm_common.admin import SortPublishedAdmin


# Register your models here.
class SocialLinksAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']


class SlideAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']


class CharacteristicsAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']


class BenefitsAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']


admin.site.register(Slide, SlideAdmin)
admin.site.register(SocialLinks, SocialLinksAdmin)
admin.site.register(Characteristics, CharacteristicsAdmin)
admin.site.register(Benefits, BenefitsAdmin)
