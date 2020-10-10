from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager


class CustomUser(UserManager):
    def get_by_natural_key(self, username):
        get_username = '{}__iexact'.format(self.model.USERNAME_FIELD)
        return self.get(**{get_username: username})


class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    thumbnail = models.ImageField(upload_to='profilePhoto')
    last_logout = models.DateTimeField(auto_now=True, blank=True, null=True)

    objects = CustomUser()

    def __str__(self):
        return self.username


class Room(models.Model):
    name = models.CharField(max_length=100, unique=True)
    users_lists = models.ManyToManyField(User, related_name='users')
    time_stamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Thread(models.Model):
    first_user = models.ForeignKey(User, on_delete=models.CASCADE)
    second_user = models.ForeignKey(User, related_name='other_users', on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)
    time_stamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.first_user.username


class Message(models.Model):
    message = models.TextField()
    thread = models.ForeignKey(Thread, related_name='threads', on_delete=models.CASCADE, null=True)
    room = models.ForeignKey(Room, related_name='rooms', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False, null=True)
    time_stamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message



