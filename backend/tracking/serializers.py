from rest_framework import serializers

from tracking.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    to_user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Notification
        fields = ['to_user_id']

    def create(self, validated_data):
        request = self.context.get('request')
        from_user = request.user
        to_user_id = validated_data.pop('to_user_id')
        to_user = User.objects.get(id=to_user_id)

        return Notification.objects.create(from_user=from_user, to_user=to_user, **validated_data)
