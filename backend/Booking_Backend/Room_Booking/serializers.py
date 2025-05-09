from rest_framework import serializers

from .models import Room, Hotel, Customer, Booking

class RoomSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Room
		fields = ['url', 'id', 'name', 'type', 'pricePerNight', 'currency', 'maxOccupancy', 'description']

class HotelSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Hotel
		fields = ['url', 'id', 'name', 'location', 'rating', 'description']

class CustomerSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Customer
		fields = ['url', 'id', 'name', 'email', 'phone_number', 'rating_given']

class BookingSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Booking
		fields = ['url', 'id', 'customer', 'room', 'check_in_date', 'check_out_date', 'status', 'number_of_people']