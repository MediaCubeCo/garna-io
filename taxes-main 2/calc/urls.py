from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("states/", views.states, name="states"),
    path("calculate/", views.calculate, name="calculate"),
]
