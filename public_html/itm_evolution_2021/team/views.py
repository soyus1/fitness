from django.shortcuts import render
from django.views.generic import TemplateView, DetailView, CreateView
from .models import Team, Workout, ScheduleDirections, ScheduleClasses, Schedule, ScheduleHall, ScheduleInstructors, ScheduleTime, RequestViewFrm
from itm_common.views import PagedListView
from datetime import datetime, timedelta
from django.http import JsonResponse


# Create your views here.
class TeamView(TemplateView):
    template_name = 'team/team.html'

    def get_context_data(self, **kwargs):
        context = super(TeamView, self).get_context_data(**kwargs)
        context['team_list'] = Team.pub_objects.all()
        return context


class TeamDetailView(DetailView):
    template_name = 'team/team-detail.html'
    context_object_name = 'team'
    model = Team

    def get_context_data(self, **kwargs):
        context = super(TeamDetailView, self).get_context_data(**kwargs)
        id = context['team'].id
        return context


class WorkoutView(TemplateView):
    template_name = 'team/workout.html'

    def get_context_data(self, **kwargs):
        context = super(WorkoutView, self).get_context_data(**kwargs)
        context['workout_list'] = Workout.pub_objects.all()
        return context


class WorkoutDetailView(DetailView):
    template_name = 'team/workout-detail.html'
    context_object_name = 'workout'
    model = Workout

    def get_context_data(self, **kwargs):
        context = super(WorkoutDetailView, self).get_context_data(**kwargs)
        id = context['workout'].id
        return context


class ScheduleView(TemplateView):
    template_name = 'team/schedule.html'

    def get_context_data(self, **kwargs):
        context = super(ScheduleView, self).get_context_data(**kwargs)
        context['directions_list'] = ScheduleDirections.pub_objects.all()  # Schedule, ScheduleHall,
        context['classes_list'] = ScheduleClasses.pub_objects.all()
        context['instructors_list'] = ScheduleInstructors.pub_objects.all()
        context['schedule_list'] = Schedule.pub_objects.all()
        context['schedule_time'] = ScheduleTime.pub_objects.all()

        today = datetime.today()
        monday_date = today - timedelta(days=today.weekday())
        sunday_date = monday_date + timedelta(days=6)
        next_monday_date = monday_date + timedelta(days=7)
        next_sunday_date = next_monday_date + timedelta(days=6)

        # schedule_time_list = Schedule.pub_objects.distinct().filter(date__range=[monday_date, sunday_date]).values_list('date', flat=True)

        week_dates = [monday_date + timedelta(days=i) for i in range(7)]
        next_week_dates = [next_monday_date + timedelta(days=i) for i in range(7)]
        # week_dates = [str((monday_date + timedelta(days=i)).date()) for i in range(7)]
        context['monday_date'] = monday_date
        context['sunday_date'] = sunday_date
        context['week_dates'] = week_dates
        context['next_monday_date'] = next_monday_date
        context['next_sunday_date'] = next_sunday_date
        context['next_week_dates'] = next_week_dates

        # context['schedule_time_list'] = schedule_time_list
        return context


class RequestViewFrmView(CreateView):
    template_name = 'team/form_view.html'
    model = RequestViewFrm
    fields = ['name', 'phone', ]
    success_url = '/'

    def form_valid(self, form):
        obj = form.save()
        if self.request.is_ajax():
            try:
                obj.send_email(self.request)

                data = {'message': 'Сообщение отправлено. Мы обязательно свяжемся с Вами в ближайшее время.', 'flag': True}

            except Exception:
                data = {'message': 'При отправке формы произошла ошибка!', 'flag': False}

        else:
            data = {'message': 'При отправке формы произошла ошибка!', 'flag': False}

        return JsonResponse(data)

    def form_invalid(self, form):
        temp = 1
        return temp
