from django.views.generic import DetailView
from django.conf import settings

from django.urls import reverse
from django.http import HttpResponseRedirect, HttpResponseBadRequest

from .models import Page, MetaData

from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.contrib.admin.views.decorators import staff_member_required

from itm_evolution_2021.settings import DEFAULT_PAGES_TEMPLATE


@method_decorator(ensure_csrf_cookie, name='dispatch')
class PageDetail(DetailView):
    """
    Вьюха для отображения страниц. Стоит переопределить шаблон, ибо он здесь просто как заглушка.
    """
    context_object_name = 'page'
    template_name = getattr(settings, DEFAULT_PAGES_TEMPLATE, 'itm_main/page_detail.html')

    def get_queryset(self):
        return Page.pub_objects.all()


@staff_member_required
def create_meta(request):
    if request.GET['url']:
        try:
            meta = MetaData.objects.get(link=request.GET['url'])
        except MetaData.DoesNotExist:
            meta = MetaData()
            meta.title = "Сайт"
            meta.description = "Описание"
            meta.keywords = "Ключевые слова"
            meta.link = request.GET['url']

            meta.save()

        return HttpResponseRedirect(reverse('admin:itm_main_metadata_change', args=(meta.id,)))
    else:
        return HttpResponseBadRequest(request)
