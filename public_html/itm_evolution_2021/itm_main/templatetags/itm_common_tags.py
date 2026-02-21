from django.conf import settings
from django import template
from django.utils.html import strip_spaces_between_tags

from django.template import Context, Template, Node, TemplateSyntaxError, Variable

register = template.Library()


class SmartSpacelessNode(template.Node):
    def __init__(self, nodelist):
        self.nodelist = nodelist

    def render(self, context):
        content = self.nodelist.render(context)
        return content if settings.DEBUG else strip_spaces_between_tags(content.strip())


@register.tag
def smart_spaceless(parser, token):
    """
    Removes whitespace between HTML tags, including tab and newline characters,
    but only if settings.DEBUG = False

    Example usage:
        {% load template_additions %}
        {% smart_spaceless %}
            <p>
                <a href="foo/">Foo</a>
            </p>
        {% end_smart_spaceless %}

    This example would return this HTML:

        <p><a href="foo/">Foo</a></p>

    Only space between *tags* is normalized -- not space between tags and text.
    In this example, the space around ``Hello`` won't be stripped:

        {% smart_spaceless %}
            <strong>
                Hello
            </strong>
        {% end_smart_spaceless %}
    """
    nodelist = parser.parse(('end_smart_spaceless',))
    parser.delete_first_token()
    return SmartSpacelessNode(nodelist)


@register.simple_tag(takes_context=True)
def url_replace(context, field, value):
    request = context['request']
    d = request.GET.copy()
    d[field] = value
    return d.urlencode()


@register.simple_tag(takes_context=True)
def url_delete(context, field):
    request = context['request']
    d = request.GET.copy()
    del d[field]
    return d.urlencode()


@register.filter
def add_class_to_field(value, arg):
    css = value.field.widget.attrs.get('class', None)
    if css:
        css_classes = css.split(' ')
    else:
        css_classes = None
    if css_classes and arg not in css_classes:
        css_classes = '%s %s' % (css_classes, arg)
    else:
        css_classes = arg
    return value.as_widget(attrs={'class': css_classes})
