from rest_framework import permissions

class IsMechanic(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return (
            user
            and user.is_authenticated
            and user.role == 'mechanic'
        )