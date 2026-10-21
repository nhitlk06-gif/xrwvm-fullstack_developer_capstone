from django.contrib import admin
from .models import CarMake, CarModel


class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1


class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year', 'dealer_id')
    list_filter = ('car_make', 'type', 'year')
    search_fields = ('name',)


class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('name', 'country')
    inlines = [CarModelInline]


admin.site.site_header = "Best Cars Administration"
admin.site.site_title = "Best Cars Admin Portal"
admin.site.index_title = "Welcome to Best Cars Administration"

admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)

