from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Team, Workout


class TeamSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.6

    def items(self):
        return Team.pub_objects.all()

    def lastmod(self, obj):
        return obj.pub_date

    def location(self, item):
        return reverse('team:team-detail', args=(item.slug, ))


class WorkoutSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.6

    def items(self):
        return Workout.pub_objects.all()

    def lastmod(self, obj):
        return obj.pub_date

    def location(self, item):
        return reverse('team:workout-detail', args=(item.slug, ))


class TeamStaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = 'weekly'

    def items(self):
        return ['team:team', 'team:workout', 'team:schedule', ]

    def location(self, item):
        return reverse(item)
