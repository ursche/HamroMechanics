from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.


class UserCreateAPIView(APIView):

    def post(self, request):
        print(self)
        print("-"*10)
        print(request.data)
        print(request.FILES)

        return Response({"data": "received"})