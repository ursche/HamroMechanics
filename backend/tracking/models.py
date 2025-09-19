from django.db import models

from users.models import User
from mechanics.models import MechanicProfile

# Create your models here.

class Notification(models.Model):
    # Customer and Mechanics are both users, hence the names

    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications_as_user")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications_as_mechanic")
    accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.to_user} by {self.from_user}"