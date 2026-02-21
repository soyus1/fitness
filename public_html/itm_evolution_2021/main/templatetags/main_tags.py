from django import template
from ..models import SocialLinks

register = template.Library()


@register.simple_tag(takes_context=True)
def social_link_show(context):
    social_link = SocialLinks.pub_objects.all()
    return social_link
