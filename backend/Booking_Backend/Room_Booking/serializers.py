from rest_framework import serializers

from .models import Room, Hotel, Customer, Booking, RoomImage, HotelImage

class RoomImageSerializer(serializers.ModelSerializer):
    room = serializers.HyperlinkedRelatedField(view_name='room-detail', queryset=Room.objects.all())
    class Meta:
        model = RoomImage
        fields = ['url', 'id', 'image', 'caption', 'room']


class HotelImageSerializer(serializers.ModelSerializer):
	hotel = serializers.HyperlinkedRelatedField(view_name='hotel-detail', queryset=Hotel.objects.all())
	class Meta:
		model = HotelImage
		fields = ['url', 'id', 'image', 'caption', 'hotel']


class BookingSerializer(serializers.HyperlinkedModelSerializer):
	customer = serializers.HyperlinkedRelatedField(view_name='customer-detail', queryset=Customer.objects.all())
	room = serializers.HyperlinkedRelatedField(view_name='room-detail', queryset=Room.objects.all())
	class Meta:
		model = Booking
		fields = ['url', 'id', 'customer', 'room', 'check_in_date', 'check_out_date', 'status', 'number_of_people']
  

class RoomSerializer(serializers.HyperlinkedModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True)
    hotel = serializers.HyperlinkedRelatedField(view_name='hotel-detail', queryset=Hotel.objects.all())
    bookings = BookingSerializer(many=True, read_only=True)
    class Meta:
        model = Room
        fields = ['url', 'id', 'name', 'type', 'pricePerNight', 'currency', 'maxOccupancy', 'description', 'images', 'bookings', 'availability', 'hotel']


class HotelSerializer(serializers.HyperlinkedModelSerializer):
	images = HotelImageSerializer(many=True, read_only=True)
	rooms = RoomSerializer(many=True, read_only=True)
	class Meta:
		model = Hotel
		fields = ['url', 'id', 'name', 'location', 'description', 'sum_of_ratings', 'contact_info', 'number_of_ratings', 'images', 'rooms']
  
  
class CustomerSerializer(serializers.HyperlinkedModelSerializer):
    bookings = BookingSerializer(many=True, read_only=True)
    class Meta:
        model = Customer
        fields = ['url', 'id', 'name', 'email', 'phone_number', 'rating_given', 'bookings']
