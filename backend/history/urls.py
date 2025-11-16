from django.urls import path
from .views import HistoryList

urlpatterns = [
    path('', HistoryList.as_view()),
]
