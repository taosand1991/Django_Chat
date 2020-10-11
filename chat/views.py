from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from .serializers import *
from django.db.models import Q
import pusher
from django.utils import timezone
import os

pusher_client = pusher.Pusher(
    app_id='1085616',
    key=os.environ.get('PUSHER_KEY'),
    secret=os.environ.get('PUSHER_SECRET'),
    cluster='eu',
    ssl=True
)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class RoomViewSet(viewsets.ModelViewSet):
    serializer_class = RoomsSerializer
    queryset = Room.objects.all()


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()


@api_view(['GET'])
def get_room(request, pk):
    room = get_object_or_404(Room, pk=pk)
    room.users_lists.add(request.user)
    messages = Message.objects.filter(room=room, user=request.user)
    for message in messages:
        message.is_read = True
        message.save()
    is_clicked = True
    serializer = RoomsSerializer(room, context={'request': request, 'is_clicked': is_clicked})
    return Response(serializer.data,  status=status.HTTP_200_OK)


@api_view(['POST', 'GET'])
def create_message(request):
    if request.method == 'POST':
        serializer = MessageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(id=request.user.id)
            pusher_client.trigger('messages', 'send-message', {'message': 'good to know very well'})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        queryset = Message.objects.all().order_by('time_stamp')
        serializer = MessageSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def user_typing(request):
    user = request.user.username
    room_number = request.data['roomNumber']
    socket_id = request.data['socket_id']
    data = {'user': user, 'room_number': room_number}
    pusher_client.trigger('messages', 'user-typing', data, socket_id=socket_id)
    return Response(user, status=status.HTTP_200_OK)


@api_view(['GET'])
def stop_typing(request):
    pusher_client.trigger('messages', 'stop-typing', {'message': 'good to know very well'})
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def thread_typing(request):
    user = request.user.username
    thread_id = request.data['thread']
    socket_id = request.data['socket_id']
    print(thread_id)
    data = {'user': user, 'thread_id': thread_id}
    pusher_client.trigger('messages', 'thread-typing', data, socket_id=socket_id)
    return Response(user, status=status.HTTP_200_OK)


@api_view(['GET'])
def stop_thread(request):
    pusher_client.trigger('messages', 'stop-thread', {'message': 'good to know very well'})
    return Response(status=status.HTTP_200_OK)


@api_view(['POST', 'GET'])
def create_thread(request):
    other_user = request.data['other_user']
    first_user = request.user
    try:
        second_user = User.objects.get(username__iexact=other_user)
        if second_user == first_user:
            data = 'You cannot add yourself in the chat'
            return Response(data, status=status.HTTP_200_OK)
        Thread.objects.create(first_user=first_user, second_user=second_user)
        data = 'contacts created'
        return Response(data, status=status.HTTP_200_OK)
    except:
        data = 'The username is invalid'
        return Response(data, status=status.HTTP_400_BAD_REQUEST)
    # if second_user is None:
    #     data = 'The username is invalid'
    #     return Response(data, status=status.HTTP_400_BAD_REQUEST)
    # else:
    #     Thread.objects.create(first_user=first_user, second_user=second_user)
    #     data = 'contacts created'
    #     return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_thread(request, first_user=None, other_user=None):
    thread_qs = Thread.objects.filter(first_user=first_user, second_user=other_user)
    if thread_qs.exists():
        thread = thread_qs[0]
        serializer = ThreadSerializer(thread, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def list_threads(request):
    queryset = Thread.objects.filter(Q(first_user=request.user) | Q(second_user=request.user))
    serializer = ThreadSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def logout(request):
    user = User.objects.get(username=request.user.username)
    user.last_logout = timezone.now()
    user.save()