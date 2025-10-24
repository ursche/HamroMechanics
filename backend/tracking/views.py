
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tracking.models import Notification
from tracking.serializers import NotificationCreateSerializer, NotificationListSerializer

# Create your views here.


class NotificationCreateAPIView(CreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

class NotificationListAPIView(ListAPIView):
    serializer_class = NotificationListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(to_user=self.request.user)
        


class AcceptRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, to_user=request.user)
            notification.accepted = True
            notification.save()

            room_name = f"tracking_{notification.id}"

            return Response({
                "detail": "Request accepted",
                "room_name": room_name,
                "mechanic_name": request.user.full_name
            })
        except Notification.DoesNotExist:
            return Response({"detail": "Notification not found"}, status=404)