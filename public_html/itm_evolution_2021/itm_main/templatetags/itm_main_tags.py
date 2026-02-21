import re

from django import template
# from django.core.urlresolvers import reverse, NoReverseMatch
from django.urls import reverse, NoReverseMatch
from django.template.loader import render_to_string
from ..models import MetaData, HTMLBlock, TextBlock, StringBlock, ImageBlock, SliderBlock, SliderBlockSlide
from django.utils.safestring import mark_safe
from django.utils.encoding import force_text

from django.contrib.staticfiles import finders
from django.core.files import File

from datetime import datetime

import os

register = template.Library()


@register.simple_tag(takes_context=True)
def active_link(context, pattern_or_urlname, id=None):
    try:
        if id:
            pattern = '^' + reverse(pattern_or_urlname, args=(id,)) + '$'
        else:
            pattern = '^' + reverse(pattern_or_urlname) + '$'
    except NoReverseMatch:
        pattern = pattern_or_urlname
    path = context['request'].path
    if re.search(pattern, path):
        return 'active'
    return ''


@register.simple_tag(takes_context=True)
def active_link_child(context, pattern_or_urlname):
    try:
        pattern = '^' + reverse(pattern_or_urlname)
    except NoReverseMatch:
        pattern = pattern_or_urlname
    path = context['request'].path
    if re.search(pattern, path):
        return 'active'
    return ''


# @register.assignment_tag(takes_context=True)
@register.simple_tag(takes_context=True)
def get_meta(context):
    request = context['request']

    try:
        meta = MetaData.objects.get(link=request.path)
    except MetaData.DoesNotExist:
        meta = None

    return meta


class BlockNode(template.Node):
    block_id = ''

    model = None

    template = None

    def __init__(self, nodelist, block_id, model, template):
        self.nodelist = nodelist
        self.block_id = block_id
        self.model = model
        self.template = template

    def render(self, context):
        try:
            block = self.model.objects.get(token=self.block_id)
        except self.model.DoesNotExist:
            output = self.nodelist.render(context)

            block = self.model.objects.create(token=self.block_id, value=output)

        request = context['request']

        return render_to_string(self.template,
                                {'value': block.value,
                                    'admin_path': block.admin_change_path(), },
                                request=request)


def parseBlock(parser, token, endblock):
    try:
        # split_contents() knows not to split quoted strings.
        tag_name, block_id = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError(
            "%r tag требует только один аргумент" % token.contents.split()[0]
        )
    if block_id[0] == block_id[-1] and block_id[0] in ('"', "'"):
        raise template.TemplateSyntaxError(
            "%r аргумент тега должен быть без кавычек" % tag_name
        )
    nodelist = parser.parse((endblock,))
    parser.delete_first_token()
    return block_id, nodelist


@register.tag()
def html_block(parser, token):
    block_id, nodelist = parseBlock(parser, token, 'end_html_block')
    return BlockNode(nodelist, block_id, HTMLBlock, 'itm_main/htmlblock.html')


@register.tag()
def text_block(parser, token):
    block_id, nodelist = parseBlock(parser, token, 'end_text_block')
    return BlockNode(nodelist, block_id, TextBlock, 'itm_main/textblock.html')


@register.tag()
def string_block(parser, token):
    block_id, nodelist = parseBlock(parser, token, 'end_string_block')
    return BlockNode(nodelist, block_id, TextBlock, 'itm_main/stringblock.html')


@register.inclusion_tag(takes_context=True, filename='itm_main/stringblock.html')
def get_string_block(context, block_id, default_value):
    try:
        block = StringBlock.objects.get(token=block_id)
    except StringBlock.DoesNotExist:
        block = StringBlock.objects.create(token=block_id, value=default_value)

    request = context['request']

    return {'value': block.value, 'admin_path': block.admin_change_path(), 'request': request, }


@register.simple_tag()
def get_only_string_block(block_id, default_value):
    try:
        block = StringBlock.objects.get(token=block_id)
    except StringBlock.DoesNotExist:
        block = StringBlock.objects.create(token=block_id, value=default_value)

    return block.value


def find_static(path):
    result = finders.find(path)

    return result


@register.inclusion_tag(takes_context=True, filename='itm_main/imageblock.html')
def get_image_block(context, block_id, default_value, klass=None, id=None):
    """
    Работает только с путями из статики! Т.е. нужно забивать туды все то, что забиваешь в static тэг!
    :param context:
    :param block_id:
    :param default_value:
    :param klass:
    :param id:
    :return:
    """
    try:
        block = ImageBlock.objects.get(token=block_id)
    except ImageBlock.DoesNotExist:
        path = find_static(default_value)
        block = ImageBlock()

        block.token = block_id

        reopen = open(path, 'rb')
        django_file = File(reopen)

        file_name = os.path.basename(path)

        block.value.save(file_name, django_file, save=True)

        block.save()

    request = context['request']

    return {'value': block.value, 'width': block.width, 'height': block.height, 'admin_path': block.admin_change_path(),
            'class': klass, 'id': id, 'request': request, }


@register.simple_tag(takes_context=True)
def get_image_url(context, block_id, default_value):
    """
    Работает только с путями из статики! Т.е. нужно забивать туды все то, что забиваешь в static тэг!
    Эта штука нужна для вставки только url изображения. Т.е. для background-style а-за-за-за :)
    :param context:
    :param block_id:
    :param default_value:
    :param klass:
    :param id:
    :return:
    """
    try:
        block = ImageBlock.objects.get(token=block_id)
    except ImageBlock.DoesNotExist:
        path = find_static(default_value)
        block = ImageBlock()

        block.token = block_id

        reopen = open(path, 'rb')
        django_file = File(reopen)

        file_name = os.path.basename(path)

        block.value.save(file_name, django_file, save=True)

        block.save()

    request = context['request']

    return block.value.url


@register.simple_tag()
def get_copyright_year(startYear):
    current_year = datetime.now().year

    if startYear > current_year:
        return '%d - %d' % (current_year, startYear)
    elif startYear < current_year:
        return '%d - %d' % (startYear, current_year)
    else:
        return startYear


@register.inclusion_tag(takes_context=True, filename='itm_main/imageblock_fancybox.html')
def get_image_block_fancybox(context, block_id, default_value, klass=None, id=None):
    """
    Работает только с путями из статики! Т.е. нужно забивать туды все то, что забиваешь в static тэг!
    :param context:
    :param block_id:
    :param default_value:
    :param klass:
    :param id:
    :return:
    """
    try:
        block = ImageBlock.objects.get(token=block_id)
    except ImageBlock.DoesNotExist:
        path = find_static(default_value)
        block = ImageBlock()

        block.token = block_id

        reopen = open(path, 'rb')
        django_file = File(reopen)

        file_name = os.path.basename(path)

        block.value.save(file_name, django_file, save=True)

        block.save()

    request = context['request']

    return {'value': block.value, 'admin_path': block.admin_change_path(),
            'class': klass, 'id': id, 'request': request, }


class SliderBlockNode(template.Node):
    def __init__(self, nodelist_loop, block_id, initials):
        self.nodelist_loop = nodelist_loop
        self.block_id = block_id
        self.initials = initials

    def render(self, context):
        try:
            slider = SliderBlock.objects.get(token=self.block_id)
        except SliderBlock.DoesNotExist:
            slider = SliderBlock.objects.create(token=self.block_id)

            for img_path in self.initials:
                img_value = SliderBlockSlide()
                path = find_static(img_path)

                reopen = open(path, 'rb')
                django_file = File(reopen)

                file_name = os.path.basename(path)

                img_value.block = slider

                img_value.image.save(file_name, django_file, save=True)

                img_value.save()

        slides = SliderBlockSlide.objects.filter(block=slider).all()

        nodelist = []

        with context.push():
            for slide in slides:
                context['slide'] = slide.image

                for node in self.nodelist_loop:
                    nodelist.append(node.render_annotated(context))

        return mark_safe(''.join(force_text(n) for n in nodelist))


def parseSliderBlock(parser, token, endblock):
    # split_contents() knows not to split quoted strings.
    parser_values = token.split_contents()

    if len(parser_values) < 2:
        raise template.TemplateSyntaxError(
            "%r tag требует id в качестве первого аргумента, и initial в последующих" % token.contents.split()[0]
        )

    initial = []
    block_id = None
    counter = 0

    for value in parser_values:
        counter += 1
        if counter == 1:
            continue
        elif counter == 2:
            block_id = value
        else:
            initial.append(value.replace("'", "").replace("\"", ""))

    if block_id[0] == block_id[-1] and block_id[0] in ('"', "'"):
        raise template.TemplateSyntaxError(
            "%r аргумент тега должен быть без кавычек" % token.contents.split()[0]
        )

    nodelist = parser.parse((endblock,))
    parser.delete_first_token()

    return block_id, nodelist, initial


@register.tag()
def slider_block(parser, token):
    block_id, nodelist, initial = parseSliderBlock(parser, token, 'end_slider_block')
    return SliderBlockNode(nodelist, block_id, initial)


