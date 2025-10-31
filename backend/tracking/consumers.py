import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"tracking_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from frontend
    async def receive(self, text_data):
        data = json.loads(text_data)
        # Expect data: {"latitude": ..., "longitude": ...}
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'location_update',
                'latitude': data['latitude'],
                'longitude': data['longitude'],
                'user_type': data.get('user_type')  # 'mechanic' or 'customer'
            }
        )

    # Receive message from group
    async def location_update(self, event):
        await self.send(text_data=json.dumps(event))
