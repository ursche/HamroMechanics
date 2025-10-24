from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import UserSerializer
from users.models import User

class UserCreateAPIView(APIView):

    def post(self, request):
        user_data = {
            'email': request.data['email'],
            'full_name': request.data['full_name'],
            'password': request.data['password'], 
            'phone': request.data['phone'],
            'role': request.data['role']
        }

        serializer = UserSerializer(data=user_data)

        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role,
                'phone': user.phone,
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class IsPhoneRegisteredAPIView(APIView):
    def post(self, request):
        try:
            if request.data.get("phone"):
                phone = request.data.get("phone")
                obj = User.objects.get(phone=phone)

                if obj:
                    return Response({"detail": "EXISTS"})
            else:
                return Response({"error": "'phone' is missing."})
        except e:
            return Response({"detail": "DOES_NOT_EXISTS"})
        