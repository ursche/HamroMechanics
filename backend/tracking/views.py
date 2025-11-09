
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tracking.models import Notification
from tracking.serializers import NotificationCreateSerializer, NotificationListSerializer


from mechanics.permissions import IsMechanic
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

    def post(self, request, notification_id):
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