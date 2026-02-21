from django.contrib import admin
from itm_common.admin import SortPublishedAdmin
from adminsortable.admin import SortableTabularInline
from .models import Team, Workout, ScheduleDirections, ScheduleClasses, ScheduleInstructors, ScheduleHall, Schedule, ScheduleTime, RequestViewFrm


class TeamAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']
    prepopulated_fields = {"slug": ("title",)}


class WorkoutAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']
    prepopulated_fields = {"slug": ("title",)}
    
    
class ScheduleAdmin(SortPublishedAdmin):
    list_display = ['id', 'classes', 'instructor', 'hall', 'date', 'time', 'publicated']
    list_filter = ['hall', 'instructor', 'classes', 'time', ]
    list_editable = ['classes', 'instructor', 'hall', 'date', 'time', 'publicated']
    
    
class ScheduleDirectionsAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']


class ScheduleClassesAdmin(SortPublishedAdmin):
    list_display = ['title', 'direction', 'publicated']
    list_filter = ['direction', ]
    search_fields = ['title', ]


class ScheduleHallAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']


class ScheduleInstructorsAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']
    search_fields = ['title', ]
    
    
class ScheduleTimeAdmin(SortPublishedAdmin):
    list_display = ['title', 'publicated']
    
    
class RequestViewFrmAdmin(admin.ModelAdmin):
    list_display = ['id', 'phone', 'created']


admin.site.register(Team, TeamAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(ScheduleDirections, ScheduleDirectionsAdmin)
admin.site.register(ScheduleClasses, ScheduleClassesAdmin)
admin.site.register(ScheduleHall, ScheduleHallAdmin)
admin.site.register(ScheduleInstructors, ScheduleInstructorsAdmin)
admin.site.register(ScheduleTime, ScheduleTimeAdmin)
admin.site.register(RequestViewFrm, RequestViewFrmAdmin)
