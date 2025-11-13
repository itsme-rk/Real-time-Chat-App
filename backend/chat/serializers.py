from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ChatRoom, Message


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "receiver", "text", "timestamp", "is_read"]



class ChatRoomSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ["id", "users", "created_at", "last_message", "unread_count"]

    def get_last_message(self, room):
        last = room.messages.order_by("-timestamp").first()
        return MessageSerializer(last).data if last else None

    def get_unread_count(self, room):
        active_user_id = self.context.get("active_user_id")
        if not active_user_id:
            return 0

        return room.messages.filter(
            receiver_id=active_user_id,
            is_read=False
        ).count()

