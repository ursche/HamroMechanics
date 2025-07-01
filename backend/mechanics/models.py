from django.db import models
from users.models import User

# Create your models here.

def mechanic_doc_upload_path(instance, filename):
    return f"mechanics/{instance.user.id}/{filename}"

class MechanicProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mechanic_profile')
    
    is_available = models.BooleanField(default=True)
    current_lat = models.FloatField(null=True, blank=True)
    current_lng = models.FloatField(null=True, blank=True)
    experience_years = models.IntegerField(default=0)
    specialization = models.CharField(max_length=100, blank=True)
    affiliated_to = models.CharField(max_length=100, null=True, blank=True)

    # Docs
    citizenship_doc = models.FileField(upload_to=mechanic_doc_upload_path, null=True, blank=True)
    license_doc = models.FileField(upload_to=mechanic_doc_upload_path, null=True, blank=True)
    company_affiliation_doc = models.FileField(upload_to=mechanic_doc_upload_path, null=True, blank=True)

    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Mehanic: {self.user.full_name} ({'Verified' if self.is_verified else 'Not Verified'})"
