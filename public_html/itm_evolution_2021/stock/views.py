from django.shortcuts import render
from django.views.generic import TemplateView, DetailView, CreateView
from .models import Stock
from itm_common.views import PagedListView


# Create your views here.
class StockView(TemplateView):
    template_name = 'stock/action.html'

    def get_context_data(self, **kwargs):
        context = super(StockView, self).get_context_data(**kwargs)
        context['stock_list'] = Stock.pub_objects.order_by('-pub_date')
        return context


class StockDetailView(DetailView):
    template_name = 'stock/action-detail.html'
    context_object_name = 'stock'
    model = Stock

    def get_context_data(self, **kwargs):
        context = super(StockDetailView, self).get_context_data(**kwargs)
        id = context['stock'].id
        return context
