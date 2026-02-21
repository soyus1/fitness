from django import template
from ..models import Stock

register = template.Library()


@register.simple_tag(takes_context=True)
def stock_show(context):
    stock_list = Stock.pub_objects.all().order_by('-pub_date')[:3]
    return stock_list
