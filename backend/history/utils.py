from .models import ServiceHistory

def add_history(user, mechanic, action, description,):
    ServiceHistory.objects.create(
        user=user,
        mechanic=mechanic,
        action=action,
        description=description,
    
    )
