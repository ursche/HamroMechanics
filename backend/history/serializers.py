from rest_framework import serializers
from .models import ServiceHistory

from mechanics.serializers import MechanicInfoSerializer
from users.serializers import UserInfoSerializer

class ServiceHistorySerializer(serializers.ModelSerializer):
    user = UserInfoSerializer()
    mechanic = UserInfoSerializer()
    class Meta:
        model = ServiceHistory
        fields = ['id', 'user', 'mechanic', 'action', 'description', 'timestamp']
