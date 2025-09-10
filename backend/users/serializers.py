from rest_framework import serializers
from mechanics.models import MechanicProfile
from users.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'password', 'role', 'phone']
        extra_kwargs = {
            'password': {'write_only': True},
        }


    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()


        if user.role == 'mechanic' and not hasattr(user, 'mechanic_profile'):
            MechanicProfile.objects.create(user=user)

        return user


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'phone'
        ]
