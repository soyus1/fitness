# from django.conf.urls import url
from django.urls import path
from . import views

app_name = 'team'

urlpatterns = [
    path('team/', views.TeamView.as_view(), name='team'),
    path('team/<slug:slug>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('workout/', views.WorkoutView.as_view(), name='workout'),
    path('workout/<slug:slug>/', views.WorkoutDetailView.as_view(), name='workout-detail'),
    path('schedule/', views.ScheduleView.as_view(), name='schedule'),
    path('requestview-frm/', views.RequestViewFrmView.as_view(), name='requestview-frm'),
]
