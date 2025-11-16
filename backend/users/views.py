from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404

from users.serializers import UserSerializer
from users.models import User

class UserCreateAPIView(APIView):

    def post(self, request):
        user_data = {
            'email': request.data['email'],
            'full_name': request.data['full_name'],
            'password': request.data['password'], 
            'phone': request.data['phone'],
            'role': request.data['role'],
        }

        if 'current_lat' in dict(request.data).keys():
            user_data['current_lat']= request.data['current_lat']
            user_data['current_lng']= request.data['current_lng']
            user_data['specialization'] = request.data['specialization']
            user_data['experience_years'] = request.data['experience_years']
            user_data['citizenship_doc'] = request.FILES.get('citizenship_doc')
            user_data['license_doc'] = request.FILES.get('license_doc')
            user_data['company_affiliation_doc'] = request.FILES.get('company_affiliation_doc')

        serializer = UserSerializer(data=user_data)
        print(serializer)

        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        refresh["role"] = user.role


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
        

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]  # Only logged-in users can delete

    def delete(self, request):
        user = request.user

        # Optional: prevent users from deleting others unless admin
        if request.user != user and not request.user.is_staff:
            return Response(
                {"error": "You do not have permission to delete this user."},
                status=status.HTTP_403_FORBIDDEN
            )

        user.delete()
        return Response(
            {"message": "User deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )

        