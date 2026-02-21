from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import News


class NewsSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.6

    def items(self):
        return News.pub_objects.all()

    def lastmod(self, obj):
        return obj.pub_date

    def location(self, item):
        return reverse('news:news-detail', args=(item.slug, ))


class NewsStaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = 'weekly'

    def items(self):
        return ['news:news', ]

    def location(self, item):
        return reverse(item)
