from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from mechanics.models import MechanicProfile
from mechanics.serializers import MechanicInfoSerializer

from utils.algorithms import haversine


# Create your views here.

class NearMechanicsListAPIView(ListAPIView):
    queryset = MechanicProfile.objects.all()
    serializer_class = MechanicInfoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        filtered_queryset = []

        # User's current location
        user_lat = float(self.request.GET.get('lat'))
        user_lng = float(self.request.GET.get('lng'))

        for obj in queryset:
            mechanic_lat = obj.user.mechanic_profile.current_lat
            mechanic_lng = obj.user.mechanic_profile.current_lng

            # distance in km of each mechanic from user
            distance = haversine(user_lat, user_lng, mechanic_lat, mechanic_lng)

            # if distance <= 2.0km, add to list
            if distance <= 2.0:
                filtered_queryset.append(obj)
        
        # return filtered list mechanics info
        return filtered_queryset


    
