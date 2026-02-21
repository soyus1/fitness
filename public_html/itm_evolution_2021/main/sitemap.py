from django.contrib.sitemaps import Sitemap
from django.urls import reverse


class MainStaticViewSitemap(Sitemap):
    changefreq = 'daily'

    def priority(self, obj):
        if obj == 'main:index':
            return 1
        return 0.8

    def items(self):
        return ['main:index', 'main:contact', ]

    def location(self, item):
        return reverse(item)
