# from django.conf.urls import url
from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('contact/', views.ContactsView.as_view(), name='contact'),
]
