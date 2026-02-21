from django import template
from ..models import Schedule, ScheduleTime 
from  datetime import datetime

register = template.Library()


@register.simple_tag(takes_context=True)
def schedule_show(context, day, time):
    cur_day = day.date()
    schedule = Schedule.pub_objects.filter(time=time).filter(date=cur_day)
    return schedule


@register.simple_tag(takes_context=True)
def time_show(context, time, monday_date, sunday_date):
    temp = []
    schedule = Schedule.pub_objects.filter(time=time).filter(date__range=[monday_date, sunday_date])
    if schedule:
        return True
    else:
        return False


@register.simple_tag(takes_context=True)
def day_active(context, date):
    day = date.date()
    today = datetime.today().date()
    if day == today:
        return True
    else:
        return False
