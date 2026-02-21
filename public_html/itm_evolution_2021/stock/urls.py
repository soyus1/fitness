# from django.conf.urls import url
from django.urls import path
from . import views

app_name = 'stock'

urlpatterns = [
    path('stock/', views.StockView.as_view(), name='stock'),
    path('stock/<slug:slug>/', views.StockDetailView.as_view(), name='stock-detail'),
]
