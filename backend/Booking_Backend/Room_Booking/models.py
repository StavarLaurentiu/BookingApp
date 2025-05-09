from django.db import models

# --- Hotel Model ---
class Hotel(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    sum_of_ratings = models.BigIntegerField(default=0)
    contact_info = models.CharField(max_length=255)
    number_of_ratings = models.BigIntegerField(default=0)

    def __str__(self):
        return self.name


# --- Room Model ---
class Room(models.Model):
    ROOM_TYPES = [
        ("single", "Single"),
        ("double", "Double"),
        ("suite", "Suite"),
        ("deluxe", "Deluxe"),
    ]
    CURRENCY_TYPES = [
        ("RON", "RON"),
        ("EUR", "EUR"),
    ]

    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='rooms')
    name = models.CharField(max_length=100, blank=True, default="")
    type = models.CharField(max_length=20, choices=ROOM_TYPES)
    pricePerNight = models.DecimalField(max_digits=10, decimal_places=2, default=150.00)
    currency = models.CharField(max_length=10, choices=CURRENCY_TYPES, default="RON")
    maxOccupancy = models.IntegerField(default=1)
    description = models.TextField(max_length=1000)
    availability = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.type} - {self.pricePerNight} {self.currency}"


# --- Customer Model ---
class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    rating_given = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.email})"


# --- Booking Model ---
class Booking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    number_of_people = models.BigIntegerField(default=1)

    def __str__(self):
        return f"Booking #{self.id} - {self.customer.name} - {self.room.name}"

    
    