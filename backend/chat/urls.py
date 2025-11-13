from django.urls import path
from .views import (
    UserListView,
    ChatRoomListView,
    CreateRoomView,
    MessageListView,
    MarkMessageReadView
)

urlpatterns = [
    path("users/", UserListView.as_view()),
    path("rooms/", ChatRoomListView.as_view()),
    path("rooms/create/", CreateRoomView.as_view()),
    path("rooms/<int:room_id>/messages/", MessageListView.as_view()),
    path("messages/<int:message_id>/read/", MarkMessageReadView.as_view()),
]
