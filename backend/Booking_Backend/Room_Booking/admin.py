from django.contrib import admin
from .models import Room, Hotel, Customer, Booking, RoomImage, HotelImage
# Register your models here.

admin.site.register(Hotel)
admin.site.register(Room)
admin.site.register(Customer)
admin.site.register(Booking)
admin.site.register(RoomImage)
admin.site.register(HotelImage)