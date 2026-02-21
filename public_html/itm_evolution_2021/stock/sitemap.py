from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Stock


class StockSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.6

    def items(self):
        return Stock.pub_objects.all()

    def lastmod(self, obj):
        return obj.pub_date

    def location(self, item):
        return reverse('stock:stock-detail', args=(item.slug, ))


class StockStaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = 'weekly'

    def items(self):
        return ['stock:stock', ]

    def location(self, item):
        return reverse(item)
