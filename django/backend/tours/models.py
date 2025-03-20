from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('agent', 'Agent'),
        ('manager', 'Manager'),
        ('client', 'Client'),
    ]
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)  # Plain text for learning
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    position = models.CharField(max_length=150)

class Tour(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    seats = models.IntegerField()
    left_seats = models.IntegerField()
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

class Booking(models.Model):
    user_info = models.TextField()
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    seats_booked = models.IntegerField()
    booking_date = models.DateField(auto_now_add=True)