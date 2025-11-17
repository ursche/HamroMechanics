from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ServiceHistory
from .serializers import ServiceHistorySerializer
from rest_framework.permissions import IsAuthenticated

class HistoryList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        history = []

        if user.role == 'mechanic':
            history = ServiceHistory.objects.filter(mechanic=user).order_by('-timestamp')
            return Response(ServiceHistorySerializer(history, many=True).data)

        history = ServiceHistory.objects.filter(user=user).order_by('-timestamp')
        return Response(ServiceHistorySerializer(history, many=True).data)
        