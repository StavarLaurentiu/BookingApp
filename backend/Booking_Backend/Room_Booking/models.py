from django.db import models

# Create your models here.
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
    
    name = models.CharField(max_length=100, blank=True, default="")
    type = models.CharField(max_length=20, choices=ROOM_TYPES)
    pricePerNight = models.DecimalField(max_digits=10, decimal_places=2, default=150.00)
    currency = models.CharField(max_length=10, choices=CURRENCY_TYPES, default="RON")
    maxOccupancy = models.IntegerField(default=1)
    description = models.TextField(max_length=1000)
    
    def __str__(self):
        return f"{self.name} - {self.type} - {self.pricePerNight} {self.currency}"
    
    