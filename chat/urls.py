from django.urls import path
from rest_framework import routers

from .views import UserViewSet, RoomViewSet, stop_typing, get_room, create_message, user_typing,\
    create_thread, get_thread, list_threads, thread_typing, stop_thread, logout

router = routers.DefaultRouter()


router.register('user', UserViewSet, basename='user')
router.register('rooms', RoomViewSet, basename='rooms')
# router.register('messages', MessageViewSet, basename='messages')

urlpatterns = router.urls


urlpatterns += [
    path('room/<int:pk>/', get_room, name='rooms'),
    path('messages/', create_message, name='messages'),
    path('typing', user_typing, name='typing'),
    path('stop', stop_typing, name='typing'),
    path('create', create_thread, name='create'),
    path('get_thread/<str:first_user>/<str:other_user>/', get_thread, name='get_thread'),
    path('list', list_threads, name='list_thread'),
    path('thread-typing', thread_typing, name='thread'),
    path('stop-thread', stop_thread, name='thread'),
    path('logout', logout, name='logout'),
]

