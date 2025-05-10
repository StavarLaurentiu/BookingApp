from django.shortcuts import render
from rest_framework import generics
from .models import Room, Hotel, Customer, Booking, RoomImage, HotelImage
from .serializers import RoomSerializer, HotelSerializer, CustomerSerializer, BookingSerializer, RoomImageSerializer, HotelImageSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse


@api_view(['GET'])
def api_root(request, format=None):
	return Response({
		'rooms': reverse('room-list', request=request, format=format),
        'hotels': reverse('hotel-list', request=request, format=format),
        'customers': reverse('customer-list', request=request, format=format),
        'bookings': reverse('booking-list', request=request, format=format),
        'room_images': reverse('roomimage-list', request=request, format=format),
        'hotel_images': reverse('hotelimage-list', request=request, format=format),
	})


class RoomList(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    

class RoomDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    

class HotelList(generics.ListCreateAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    

class HotelDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    

class CustomerList(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    
class CustomerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    
class BookingList(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    

class BookingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    

class RoomImageList(generics.ListCreateAPIView):
    queryset = RoomImage.objects.all()
    serializer_class = RoomImageSerializer
    

class RoomImageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RoomImage.objects.all()
    serializer_class = RoomImageSerializer
    
    
class HotelImageList(generics.ListCreateAPIView):
    queryset = HotelImage.objects.all()
    serializer_class = HotelImageSerializer
    

class HotelImageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = HotelImage.objects.all()
    serializer_class = HotelImageSerializer 