
from django.urls import path

from tracking import views

urlpatterns = [
    path('notifications/list/', views.NotificationListAPIView.as_view()),
    path('notifications/create/', views.NotificationCreateAPIView.as_view()),
    path('notifications/accept/<int:notification_id>/<str:lat>/<str:lng>/', views.AcceptRequestAPIView.as_view()),

    path('notifications/accepted/', views.IsRequestAcceptedAPIView.as_view()),
    
]
