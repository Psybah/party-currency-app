from django.shortcuts import render
from  rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework.response import Response
from authentication.models import CustomUser
from payment.models import Transaction
from events.models import Events as Event
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


@api_view(['PUT'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def suspend_user(request, user_id):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
    
    try:
        user = CustomUser.objects.get(username=user_id)
        user.is_active = False
        user.save()
        return Response({'message': 'User suspended successfully'}, status=200)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def activate_user(request, user_id):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
    
    try:
        user = CustomUser.objects.get(username=user_id)
        user.is_active = True
        user.save()
        return Response({'message': 'User activated successfully'}, status=200)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
    
    try:
        user = CustomUser.objects.get(username=user_id)
        transactions = Transaction.objects.filter(customer_email=user.email)
        
        # Update all related transactions
        for transaction in transactions:
            transaction.customer_email = f"{user.username} deleted"
            transaction.save()
            
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=200)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)
    


from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_admin_statistics(request):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
    
    try:
        # Get current date and time
        now = timezone.now()
        
        # Define periods: last 7 days and previous 7 days
        start_of_this_period = now - timedelta(days=7)
        start_of_previous_period = start_of_this_period - timedelta(days=7)
        
        # Get total active users count
        total_active_users = CustomUser.objects.filter(is_active=True).count()
        # Get total events
        total_events = Event.objects.all().count()
        # Get total transactions completed
        total_completed_transactions = Transaction.objects.filter(status='successful').count()
        # Get total transactions pending
        total_pending_transactions = Transaction.objects.filter(status='pending').count()
        
        # Get new active users in this period (last 7 days)
        new_users_this_week = CustomUser.objects.filter(
            is_active=True,
            date_joined__gte=start_of_this_period,
            date_joined__lt=now
        ).count()
        # Get new active users in previous period (previous 7 days)
        new_users_previous_week = CustomUser.objects.filter(
            is_active=True,
            date_joined__gte=start_of_previous_period,
            date_joined__lt=start_of_this_period
        ).count()
        
        # Get transactions in this period (last 7 days)
        transactions_this_week = Transaction.objects.filter(
            created_at__gte=start_of_this_period,
            created_at__lt=now
        ).count()
        # Get transactions in previous period (previous 7 days)
        transactions_previous_week = Transaction.objects.filter(
            created_at__gte=start_of_previous_period,
            created_at__lt=start_of_this_period
        ).count()
        
        # Get events in this period (last 7 days)
        events_this_week = Event.objects.filter(
            created_at__gte=start_of_this_period,
            created_at__lt=now
        ).count()
        # Get events in previous period (previous 7 days)
        events_previous_week = Event.objects.filter(
            created_at__gte=start_of_previous_period,
            created_at__lt=start_of_this_period
        ).count()
        
        # Calculate percentage increase for users
        if new_users_previous_week > 0:
            percentage_increase = ((new_users_this_week - new_users_previous_week) / 
                                  new_users_previous_week) * 100
        else:
            percentage_increase = 100 if new_users_this_week > 0 else 0
            
        # Calculate percentage increase for transactions
        if transactions_previous_week > 0:
            percentage_increase_transactions = ((transactions_this_week - transactions_previous_week) / 
                                               transactions_previous_week) * 100
        else:
            percentage_increase_transactions = 100 if transactions_this_week > 0 else 0
            
        # Calculate percentage increase for events
        if events_previous_week > 0:
            percentage_increase_events = ((events_this_week - events_previous_week) / 
                                         events_previous_week) * 100
        else:
            percentage_increase_events = 100 if events_this_week > 0 else 0
        
        return Response({
            'total_active_users': total_active_users,
            'new_active_users_this_week': new_users_this_week,
            'new_active_users_previous_week': new_users_previous_week,
            'percentage_increase': round(percentage_increase, 2),
            'total_completed_transactions': total_completed_transactions,
            'total_pending_transactions': total_pending_transactions,
            'transactions_this_week': transactions_this_week,
            'percentage_increase_transactions': round(percentage_increase_transactions, 2),
            'total_events': total_events,
            'events_this_week': events_this_week,
            'percentage_increase_events': round(percentage_increase_events, 2)
        }, status=200)
        
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)