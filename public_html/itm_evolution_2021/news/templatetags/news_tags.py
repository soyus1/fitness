from django import template
from ..models import News

register = template.Library()


@register.simple_tag(takes_context=True)
def news_show(context):
    news_list = News.pub_objects.all().order_by('-pub_date')[:5]
    return news_list
