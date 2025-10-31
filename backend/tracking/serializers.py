from rest_framework import serializers

from users.models import User
from tracking.models import Notification, NotificationImages

from users.serializers import UserInfoSerializer

# class NotificationSerializer(serializers.ModelSerializer):
#     to_user_id = serializers.IntegerField(write_only=True)

#     class Meta:
#         model = Notification
#         fields = ['to_user_id']

#     def create(self, validated_data):
#         request = self.context.get('request')
#         from_user = request.user
#         to_user_id = validated_data.pop('to_user_id')
#         to_user = User.objects.get(id=to_user_id)

#         return Notification.objects.create(from_user=from_user, to_user=to_user, **validated_data)


class NotificationImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    class Meta:
        model = NotificationImages
        fields = '__all__'

class NotificationCreateSerializer(serializers.ModelSerializer):
    images = NotificationImageSerializer(many=True, required=False)
    to_user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Notification
        fields = ['to_user_id', 'description', 'images']

    def create(self, validated_data):
        request = self.context.get('request')
        print(validated_data)
        from_user = request.user

        to_user_id = validated_data.pop('to_user_id')
        to_user = User.objects.get(id=to_user_id)


        images_data = validated_data.pop('images', [])

        

        notification = Notification.objects.create(from_user=from_user, to_user=to_user, **validated_data)

        for file in request.FILES.getlist('images'):
            NotificationImages.objects.create(notification=notification, image=file)

        return notification




class NotificationListSerializer(serializers.ModelSerializer):
    images = NotificationImageSerializer(many=True, required=False)
    from_user = UserInfoSerializer()
    to_user = UserInfoSerializer()
    
    class Meta:
        model = Notification
        fields = ['id', 'from_user', 'to_user', 'images', 'accepted']