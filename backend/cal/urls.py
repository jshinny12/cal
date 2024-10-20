from django.urls import path

from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('login_user/', views.login_user, name='login_user'),
    path('add_category/', views.add_category, name='add_category'),
    path('add_task/', views.add_task, name='add_task'),
    path('update_category/', views.update_category, name='update_category'),
    path('update_task/', views.update_task, name='update_task'),
    path('delete_category/', views.delete_category, name='delete_category'),
    path('delete_task/', views.delete_task, name='delete_task'),


    path('', views.home, name='home'),
]
