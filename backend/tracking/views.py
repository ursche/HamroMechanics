
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from rest_framework import status

from tracking.models import Notification
from tracking.serializers import NotificationCreateSerializer, NotificationListSerializer


from mechanics.permissions import IsMechanic

from history.models import ServiceHistory

# Create your views here.


class NotificationCreateAPIView(CreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
    #don't create duplicate request
    def create(self, request, *args, **kwargs):
        from_user = request.user
        to_user = request.data.get("to_user")
        description = request.data.get("description")

        # time range = last 2 minutes
        two_min_ago = timezone.now() - timedelta(minutes=2)

        # check duplicate entry within 2 minutes
        exists = Notification.objects.filter(
            from_user=from_user,
            to_user=to_user,
            created_at__gte=two_min_ago
        ).exists()

        if exists:
            return Response(
                {"detail": "Duplicate notification blocked (sent within last 2 minutes)."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        return super().create(request, *args, **kwargs)

class NotificationListAPIView(ListAPIView):
    serializer_class = NotificationListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(to_user=self.request.user)

class NotificationUserListAPIView(ListAPIView):
    serializer_class = NotificationListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(from_user=self.request.user)
        


class AcceptRequestAPIView(APIView):
    permission_classes = [IsAuthenticated, IsMechanic]

    def update_mechanic_location(self, request):
        user = request.user
        mechanic = user.mechanic_profile

        user.customer_lat = mechanic.current_lat
        user.customer_lng = mechanic.current_lng
        user.save()

    def get(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, to_user=request.user)
            notification.accepted = True
            notification.save()

            mechanic_lat = float(self.request.GET.get('lat'))
            mechanic_lng = float(self.request.GET.get('lng'))

            mechanic = request.user.mechanic_profile
            mechanic.current_lat = mechanic_lat
            mechanic.current_lng = mechanic_lng
            mechanic.save()

            self.update_mechanic_location(request)


            return Response({
                "detail": "Request accepted",
                "mechanic_name": request.user.full_name
            })
        except Exception as e:
            return Response({"detail": str(e)}, status=404)


class FinishRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, notification_id):
        notification = Notification.objects.get(id=notification_id)

        notification.finished = True
        notification.save()

        ServiceHistory.objects.create(user=notification.from_user, mechanic=notification.to_user, description=notification.description, action='completed')

        return Response({'details': 'Request Completed.'}, status=status.HTTP_200_OK)



