
from django.urls import path

from tracking import views

urlpatterns = [
    path('notifications/list/', views.NotificationListAPIView.as_view()),
    path('notifications/list/customer/', views.NotificationUserListAPIView.as_view()),
    path('notifications/create/', views.NotificationCreateAPIView.as_view()),
    path('notifications/accept/<int:notification_id>/', views.AcceptRequestAPIView.as_view()),
    path('notifications/finish/<int:notification_id>/', views.FinishRequestAPIView.as_view())
    
]
