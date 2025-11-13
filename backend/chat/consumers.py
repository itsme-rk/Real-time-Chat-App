import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import ChatRoom, Message

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"chat_{self.room_id}"

        # join group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # leave group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Expected payloads:
        - typing: {"type":"typing", "sender_id": 1}
        - message: {"type":"message", "text":"hi","sender_id":1}
        - read: {"type":"read", "message_id": 123}
        """
        try:
            data = json.loads(text_data)
        except Exception:
            return

        msg_type = data.get("type")

        # Typing: 
        if msg_type == "typing":
            sender_id = data.get("sender_id")
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_event",
                    "user_id": sender_id,
                },
            )
            return

        # New message
        if msg_type == "message":
            text = data.get("text", "").strip()
            sender_id = data.get("sender_id")
            if not text:
                return

            sender = await self._get_user(sender_id)
            receiver = await self._get_receiver(sender)

            if not sender or not receiver:
                # Fail silently if users can't be determined
                return

            message_obj = await self._create_message(sender, receiver, text)
            serialized = await self._serialize_message(message_obj)

            # broadcast the message
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": serialized,
                },
            )
            return

        # Read receipt
        if msg_type == "read":
            message_id = data.get("message_id")
            if not message_id:
                return
            await self._mark_read(message_id)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "read_event",
                    "message_id": message_id,
                },
            )
            return

   
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"type": "message", "message": event["message"]}))

    async def typing_event(self, event):
        await self.send(text_data=json.dumps({"type": "typing", "user_id": event.get("user_id")}))

    async def read_event(self, event):
        await self.send(text_data=json.dumps({"type": "read", "message_id": event.get("message_id")}))

   
    @database_sync_to_async
    def _get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except Exception:
            return None

    @database_sync_to_async
    def _get_receiver(self, sender):
        """
        For a room, pick the 'other' user as receiver.
        For group rooms this returns the first user who is not the sender.
        """
        room = ChatRoom.objects.get(id=self.room_id)
        other = room.users.exclude(id=sender.id).first()
        return other

    @database_sync_to_async
    def _create_message(self, sender, receiver, text):
        room = ChatRoom.objects.get(id=self.room_id)
        return Message.objects.create(chatroom=room, sender=sender, receiver=receiver, text=text)

    @database_sync_to_async
    def _serialize_message(self, message):
       
        return {
            "id": message.id,
            "text": message.text,
            "timestamp": message.timestamp.isoformat(),
            "sender": {"id": message.sender.id, "username": message.sender.username},
            "receiver": {"id": message.receiver.id, "username": message.receiver.username} if message.receiver else None,
            "is_read": message.is_read,
        }

    @database_sync_to_async
    def _mark_read(self, message_id):
        try:
            m = Message.objects.get(id=message_id)
            m.is_read = True
            m.save()
        except Message.DoesNotExist:
            pass
