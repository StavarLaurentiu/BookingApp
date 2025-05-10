from django.urls import path
from Room_Booking import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path("", views.api_root, name="api-root"),
    path("rooms/", views.RoomList.as_view(), name="room-list"),
    path("rooms/<int:pk>/", views.RoomDetail.as_view(), name="room-detail"),
    path("hotels/", views.HotelList.as_view(), name="hotel-list"),
    path("hotels/<int:pk>/", views.HotelDetail.as_view(), name="hotel-detail"),
    path("customers/", views.CustomerList.as_view(), name="customer-list"),
    path("customers/<int:pk>/", views.CustomerDetail.as_view(), name="customer-detail"),
    path("bookings/", views.BookingList.as_view(), name="booking-list"),
    path("bookings/<int:pk>/", views.BookingDetail.as_view(), name="booking-detail"),
    path("room_images/", views.RoomImageList.as_view(), name="roomimage-list"),
    path("room_images/<int:pk>/", views.RoomImageDetail.as_view(), name="roomimage-detail"),
    path("hotel_images/", views.HotelImageList.as_view(), name="hotelimage-list"),
    path("hotel_images/<int:pk>/", views.HotelImageDetail.as_view(), name="hotelimage-detail"),
]

urlpatterns = format_suffix_patterns(urlpatterns)

from django.conf import settings
from django.conf.urls.static import static


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
