from django.db import models

from users.models import User
from mechanics.models import MechanicProfile


# Create your models here.

def user_directory_path(instance, filename):
    return f'notifications/{instance.notification.from_user.id}/{filename}'


class Notification(models.Model):
    # Customer and Mechanics are both users, hence the names

    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications_as_user")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications_as_mechanic")
    description = models.TextField(null=True)
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.to_user} by {self.from_user}"

class NotificationImages(models.Model):
    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to=user_directory_path)

    def __str__(self):
        return f"Image for notification {self.notification.id}"


class LiveTrackingSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='live_user')
    mechanic = models.ForeignKey(User, on_delete=models.CASCADE, related_name='live_mechanic')
    is_active = models.BooleanField(default=True)
    started_at = models.DateTimeField(auto_now_add=True)

    def room_name(self):
        return f"session_{self.id}"
