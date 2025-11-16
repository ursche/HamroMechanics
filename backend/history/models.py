from django.db import models
from users.models import User

class ServiceHistory(models.Model):
    ACTION_TYPES = (
        ('requested', 'Service Requested'),
        ('accepted', 'Request Accepted'),
        ('tracking_started', 'Tracking Started'),
        ('completed', 'Service Completed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="history_user")
    mechanic = models.ForeignKey(User, on_delete=models.CASCADE, related_name="history_mechanic")

    action = models.CharField(max_length=50, choices=ACTION_TYPES)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.full_name} - {self.action} at {self.timestamp}"
