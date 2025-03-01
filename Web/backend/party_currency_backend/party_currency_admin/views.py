from django.shortcuts import render
from  rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework.response import Response
from authentication.models import CustomUser
from payment.models import Transaction
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from rest_framework.permissions import IsAuthenticated,AllowAny

# Create your views here.

@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_users(request):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
        
    users = CustomUser.objects.all()
    tran = Transaction.objects.filter(customer_email=request.user.email)
    total = 0;
    for t in tran:
        if tran.status == 'success':
            total+=t.amount
        
    user_data = []
    for user in users:
        user_data.append({
            'username': user.username,
            'name': f"{user.first_name} {user.last_name}",
            'role': user.type,
            'isActive': user.is_active,
            "last_login": user.last_login,
            "total_amount": f"₦{total}"
        })
    return Response({'users': user_data})


@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def suspend_user(request, user_id):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
        
    user = CustomUser.objects.get(id=user_id)
    user.is_active = False
    user.save()
    return Response({'message': 'User suspended successfully'}, status=200)

@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def activate_user(request, user_id):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
        
    user = CustomUser.objects.get(id=user_id)
    user.is_active = True
    user.save()
    return Response({'message': 'User activated successfully'}, status=200)


@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
        
    user = CustomUser.objects.get(id=user_id)
    tran = Transaction.objects.filter(customer_email=request.user.email)
    for t in tran:
        t.customer_email = f"{user.username} deleted"
    user.delete()
    return Response({'message': 'User deleted successfully'}, status=200)