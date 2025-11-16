from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ServiceHistory
from .serializers import ServiceHistorySerializer

class HistoryList(APIView):
    def get(self, request):
        history = ServiceHistory.objects.filter(user=request.user).order_by('-timestamp')
        return Response(ServiceHistorySerializer(history, many=True).data)
