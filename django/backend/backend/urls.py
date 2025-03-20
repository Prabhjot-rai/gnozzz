from django.urls import path
from tours import views

urlpatterns = [
    path('signup', views.signup),
    path('login', views.login),
    path('get-tours', views.get_tours),
    path('create-tour', views.create_tour),
    path('update-tour', views.update_tour),
    path('delete-tour', views.delete_tour),
    path('get-users', views.get_users),
    path('delete-user', views.delete_user),
]
