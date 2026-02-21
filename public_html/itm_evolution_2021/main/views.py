from django.shortcuts import render
from django.views.generic import TemplateView, DetailView, CreateView
from .models import Slide, Characteristics, Benefits
from django.http import JsonResponse, HttpResponseBadRequest


# Create your views here.
class IndexView(TemplateView):
    template_name = 'main/index.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['slide_list'] = Slide.pub_objects.all()
        context['characteristics_list'] = Characteristics.pub_objects.all()
        context['benefits_list'] = Benefits.pub_objects.all()
        return context


class ContactsView(TemplateView):
    template_name = 'main/contact.html'

    def get_context_data(self, **kwargs):
        context = super(ContactsView, self).get_context_data(**kwargs)
        # context['social_link_list'] = SocialLink.pub_objects.all()
        return context
