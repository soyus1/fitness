# from django.conf.urls import url
from django.urls import path
from . import views

app_name = 'news'

urlpatterns = [
    path('news/', views.NewsView.as_view(), name='news'),
    path('news/<slug:slug>/', views.NewsDetailView.as_view(), name='news-detail'),
]
