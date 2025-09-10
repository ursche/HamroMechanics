from django.urls import include, path
from mechanics import views

urlpatterns = [
    path('list/', views.NearMechanicsListAPIView.as_view()),
]
