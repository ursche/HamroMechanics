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

        print(token)
        return token


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    current_lat = serializers.CharField(required=False, allow_blank=True)
    current_lng = serializers.CharField(required=False, allow_blank=True)
    
    experience_years = serializers.IntegerField(required=False)
    specialization = serializers.CharField(required=False)
    affiliated_to = serializers.CharField(required=False)
    citizenship_doc = serializers.FileField(required=False)
    license_doc = serializers.FileField(required=False)
    company_affiliation_doc = serializers.FileField(required=False, allow_null=True)


    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'password', 'role', 'phone', 'current_lat', 'current_lng', 'experience_years', 'specialization', 'affiliated_to', 'citizenship_doc', 'license_doc', 'company_affiliation_doc']
        extra_kwargs = {
            'password': {'write_only': True},
            # 'current_lat': {'write_only': True},
            # 'current_lng': {'write_only': True},
        }


    def create(self, validated_data):

        password = validated_data.pop('password')
        current_lat = validated_data.pop('current_lat', None)
        current_lng = validated_data.pop('current_lng', None)
        experience_years = validated_data.pop('experience_years', None)
        specialization = validated_data.pop('specialization', None)
        affiliated_to = validated_data.pop('affiliated_to', None)
        citizenship_doc = validated_data.pop('citizenship_doc', None)
        license_doc = validated_data.pop('license_doc', None)
        company_affiliation_doc = validated_data.pop('company_affiliation_doc', None)

        user = User(**validated_data)
        user.set_password(password)
        user.save()


        if user.role == 'mechanic' and not hasattr(user, 'mechanic_profile'):
            MechanicProfile.objects.create(user=user, current_lat=current_lat,current_lng=current_lng,
            experience_years=experience_years,
            specialization=specialization,
            affiliated_to=affiliated_to,
            citizenship_doc=citizenship_doc,
            license_doc=license_doc,
            company_affiliation_doc=company_affiliation_doc
            )

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

