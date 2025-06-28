from rest_framework import serializers
from .models import MechanicProfile

class MechanicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MechanicProfile
        fields = [
            'id',
            'specialization',
            'experience_years',
            'is_available',
            'current_lat',
            'current_lng',
            'citizenship_doc',
            'license_doc',
            'company_affiliation_doc',
            'is_verified',
        ]
        
        read_only_fields = ['is_verified']
