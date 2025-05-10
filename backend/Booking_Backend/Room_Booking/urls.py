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
]

urlpatterns = format_suffix_patterns(urlpatterns)
