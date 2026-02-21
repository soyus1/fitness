from django.conf.urls import url
from . import views

app_name = 'itm_main'

urlpatterns = [
    url(r'^page/(?P<slug>[\w\-]+)/$', views.PageDetail.as_view(), name='page'),
    url(r'^admin/meta/$', views.create_meta, name='create_meta'),
]
