from rest_framework import serializers
from mechanics.models import MechanicProfile
from users.models import User
# from mechanics.serializers import MechanicLocationSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = user.role

        return token


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    current_lat = serializers.CharField(required=False)
    current_lng = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'password', 'role', 'phone', 'current_lat', 'current_lng']
        extra_kwargs = {
            'password': {'write_only': True},
            'current_lat': {'write_only': True},
            'current_lng': {'write_only': True},
        }


    def create(self, validated_data):
        password = validated_data.pop('password')
        current_lat = validated_data.pop('current_lat', None)
        current_lng = validated_data.pop('current_lng', None)

        user = User(**validated_data)
        user.set_password(password)
        user.save()


        if user.role == 'mechanic' and not hasattr(user, 'mechanic_profile'):
            MechanicProfile.objects.create(user=user, current_lat=current_lat,current_lng=current_lng)

        return user


class UserInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'phone',
            'customer_lat',
            'customer_lng',
        ]

