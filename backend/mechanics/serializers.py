from rest_framework import serializers

from mechanics.models import MechanicProfile
from users.serializers import UserInfoSerializer

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

class MechanicInfoSerializer(serializers.ModelSerializer):
    user = UserInfoSerializer()
    
    class Meta:
        model = MechanicProfile
        fields = [
            'id',
            'specialization',
            'experience_years',
            'is_available',
            'current_lat',
            'current_lng',
            'is_verified',
            'user'
        ]