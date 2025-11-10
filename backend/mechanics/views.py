import math

from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from mechanics.models import MechanicProfile
from mechanics.serializers import MechanicInfoSerializer

from utils.algorithms import haversine


# Create your views here.

# class NearMechanicsListAPIView(ListAPIView):
#     queryset = MechanicProfile.objects.all()
#     serializer_class = MechanicInfoSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         queryset = super().get_queryset()

#         filtered_queryset = []

#         # User's current location
#         user_lat = float(self.request.GET.get('lat'))
#         user_lng = float(self.request.GET.get('lng'))

#         for obj in queryset:
#             mechanic_lat = obj.user.mechanic_profile.current_lat
#             mechanic_lng = obj.user.mechanic_profile.current_lng

#             # distance in km of each mechanic from user
#             distance = haversine(user_lat, user_lng, mechanic_lat, mechanic_lng)

#             # if distance <= 2.0km, add to list
#             if distance <= 2.0:
#                 filtered_queryset.append(obj)
        
#         # return filtered list mechanics info
#         return filtered_queryset


class NearMechanicsListAPIView(ListAPIView):
    serializer_class = MechanicInfoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # User location
        user_lat = float(self.request.GET.get('lat'))
        user_lng = float(self.request.GET.get('lng'))

        user = self.request.user
        user.customer_lat = user_lat
        user.customer_lng = user_lng
        user.save()

        radius_km = 2.0  # mechanics inside 2km

        # Bounding Box Approximation
        # 1 degree latitude ≈ 111.32 km
        delta_lat = radius_km / 111.32
        delta_lng = radius_km / (111.32 * math.cos(math.radians(user_lat)))

        min_lat = user_lat - delta_lat
        max_lat = user_lat + delta_lat
        min_lng = user_lng - delta_lng
        max_lng = user_lng + delta_lng

        # Bounding box filtering
        queryset = MechanicProfile.objects.filter(
            current_lat__gte=min_lat,
            current_lat__lte=max_lat,
            current_lng__gte=min_lng,
            current_lng__lte=max_lng
        )
        print(MechanicProfile.objects.all())

        # Haversine Distance
        filtered_queryset = []
        for obj in queryset:
            mechanic_lat = obj.current_lat
            mechanic_lng = obj.current_lng

            distance = haversine(user_lat, user_lng, mechanic_lat, mechanic_lng)
            if distance <= radius_km:
                filtered_queryset.append(obj)

        print(filtered_queryset)

        return filtered_queryset


    
