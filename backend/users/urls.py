from django.urls import path
from users import views
from .views import DeleteUserView


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('isregistered/', views.IsPhoneRegisteredAPIView.as_view()),


    path('register/', views.UserCreateAPIView.as_view()),
    path('logout/', views.UserLogoutView.as_view()),
    path('delete/', DeleteUserView.as_view(), name='delete-user'),


]
