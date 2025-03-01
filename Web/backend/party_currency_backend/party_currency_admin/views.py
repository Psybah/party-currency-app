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


@api_view(['GET'])
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

@api_view(['GET'])
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

@api_view(['GET'])
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
        
        # Calculate the start of the current week (Monday)
        start_of_current_week = now - timedelta(days=now.weekday())
        start_of_current_week = start_of_current_week.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Calculate the start of the previous week
        start_of_previous_week = start_of_current_week - timedelta(days=7)
        
        # Get total active users count
        total_active_users = CustomUser.objects.filter(is_active=True).count()
        #Get total events
        total_events = Event.objects.all().count()
        #Get total transactions completed
        total_completed_transactions = Transaction.objects.filter(status='successful').count()
        #Get total transactions pending
        total_pending_transactions = Transaction.objects.filter(status='pending').count()
        
        # Get users who joined this week and are active
        new_users_this_week = CustomUser.objects.filter(
            is_active=True,
            date_joined__gte=start_of_current_week
        ).count()
        # Get Transactions this week
        transactions_this_week = Transaction.objects.filter(
            created_at__gte=start_of_current_week
        ).count()
        #Get events created this week
        events_this_week = Event.objects.filter(
            created_at__gte=start_of_current_week
        ).count()
        
        # Get users who joined previous week and are active
        new_users_previous_week = CustomUser.objects.filter(
            is_active=True,
            date_joined__gte=start_of_previous_week,
            date_joined__lt=start_of_current_week
        ).count()
        
        # Calculate percentage increase for user
        if new_users_previous_week > 0:
            percentage_increase = ((new_users_this_week - new_users_previous_week) / 
                                  new_users_previous_week) * 100
        else:
            # If there were no new users last week, we can't calculate a percentage
            # So we'll use a special value or just report the raw number
            percentage_increase = 100 if new_users_this_week > 0 else 0
         # Calculate percentage increase for transactions
        if total_pending_transactions > 0:
            percentage_increase_transactions = ((transactions_this_week - total_pending_transactions) / 
                                  total_pending_transactions) * 100
        else:
            # If there were no new transactions last week, we can't calculate a percentage
            # So we'll use a special value or just report the raw number
            percentage_increase_transactions = 100 if transactions_this_week > 0 else 0

        # Calculate percentage increase for events
        if total_events > 0:
            percentage_increase_events = ((events_this_week - total_events) / 
                                  total_events) * 100
        else:
            # If there were no new events last week, we can't calculate a percentage
            # So we'll use a special value or just report the raw number
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