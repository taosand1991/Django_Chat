from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from .models import *

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class MessageSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    room_name = serializers.ReadOnlyField(source='room.name')

    class Meta:
        model = Message
        fields = ['id', 'user_name', 'message', 'time_stamp', 'room_name', 'room', 'user', 'is_read', 'thread']


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_style': 'password'}, write_only=True)
    token = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'thumbnail', 'password', 'password2', 'token', 'messages',
                  'last_login', 'last_logout']
        extra_kwargs = {'password': {'write_only': True}}

    def get_token(self, user):
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        return token

    def get_messages(self, obj):
        return MessageSerializer(obj.message_set.all().order_by('time_stamp'), many=True).data

    def create(self, validated_data):
        user = User(username=validated_data['username'], thumbnail=validated_data['thumbnail'])
        password = validated_data['password']
        password2 = validated_data['password2']
        if password != password2:
            return serializers.ValidationError({'password': 'password does not match'})
        user.set_password(validated_data['password'])
        user.save()
        print(user)
        return user


class RoomsSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    message = serializers.SerializerMethodField()
    is_clicked = serializers.SerializerMethodField()
    users_lists = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'name', 'username', 'time_stamp', 'message', 'users_lists', 'is_clicked']

    def get_message(self, obj):
        return MessageSerializer(obj.rooms.all(), many=True).data

    def get_is_clicked(self, obj):
        if 'is_clicked' in self.context:
            return self.context['is_clicked']


class ThreadSerializer(serializers.ModelSerializer):
    thread_messages = serializers.SerializerMethodField()
    first_user = UserSerializer()
    second_user = UserSerializer()
    first_username = serializers.ReadOnlyField(source='first_user.username', read_only=True)
    second_username = serializers.ReadOnlyField(source='second_user.username', read_only=True)

    class Meta:
        model = Thread
        fields = ['id', 'first_user', 'second_user', 'time_stamp', 'updated', 'thread_messages',
                  'first_username', 'second_username']

    def get_thread_messages(self, obj):
        return MessageSerializer(obj.threads.all(), many=True).data
