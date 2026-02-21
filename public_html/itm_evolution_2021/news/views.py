from django.shortcuts import render
from django.views.generic import TemplateView, DetailView, CreateView
from .models import News, ImagesNews
from itm_common.views import PagedListView


# Create your views here.
class NewsView(TemplateView):
    template_name = 'news/news.html'

    def get_context_data(self, **kwargs):
        context = super(NewsView, self).get_context_data(**kwargs)
        context['news_list'] = News.pub_objects.order_by('-pub_date')
        return context


class NewsDetailView(DetailView):
    template_name = 'news/news-detail.html'
    context_object_name = 'news'
    model = News

    def get_context_data(self, **kwargs):
        context = super(NewsDetailView, self).get_context_data(**kwargs)
        id = context['news'].id
        context['imgs_news_list'] = ImagesNews.pub_objects.filter(news=id)
        return context
