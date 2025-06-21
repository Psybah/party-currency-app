from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from authentication.models import CustomUser
from payment.models import Transaction
from events.models import Events as Event
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from events.serializers import EventSerializerFull
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
import math
from authentication.serializers import UserSerializer2
from payment.serializers import TransactionSerializer
# Your existing views remain the same...

@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_users(request):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
        
    users = CustomUser.objects.all()
    tran = Transaction.objects.filter(customer_email=request.user.email)
    total = 0
    for t in tran:
        if t.status == 'success':  # Fixed bug: was tran.status instead of t.status
            total += t.amount
        
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


# NEW PAGINATED EVENTS VIEW WITH ENHANCED SORTING
@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_events(request):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
    
    try:
        # Get query parameters
        page = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 10)
        search = request.GET.get('search', '')
        sort_by = request.GET.get('sort_by', 'newest')  # Default to newest first
        
        # Convert to integers
        try:
            page = int(page)
            page_size = int(page_size)
        except ValueError:
            return Response({'error': 'Invalid page or page_size parameter'}, status=400)
        
        # Limit page_size to prevent abuse
        if page_size > 100:
            page_size = 100
        
        # Define sort parameter mapping
        sort_mapping = {
            'newest': '-created_at',           # Newest events first
            'oldest': 'created_at',            # Oldest events first
            'name_asc': 'event_name',          # Event name A-Z
            'name_desc': '-event_name',        # Event name Z-A
            'date_early': 'start_date',        # Earliest start date first
            'date_late': '-start_date',        # Latest start date first
        }
        
        # Start with all events
        events_queryset = Event.objects.all()  # Note: using Events (your model name)
        
        # Apply search filter if provided
        if search:
            events_queryset = events_queryset.filter(
                Q(event_name__icontains=search) |
                Q(event_description__icontains=search) |
                Q(street_address__icontains=search) |
                Q(city__icontains=search) |
                Q(state__icontains=search) |
                Q(event_author__icontains=search)|
                Q(delivery_status__icontains=search)

            )
        
        # Apply sorting
        if sort_by in sort_mapping:
            django_sort_field = sort_mapping[sort_by]
            events_queryset = events_queryset.order_by(django_sort_field)
        else:
            # Default to newest if invalid sort parameter
            events_queryset = events_queryset.order_by('-created_at')
        
        # Create paginator
        paginator = Paginator(events_queryset, page_size)
        total_pages = paginator.num_pages
        total_count = paginator.count
        
        try:
            events_page = paginator.page(page)
        except PageNotAnInteger:
            events_page = paginator.page(1)
            page = 1
        except EmptyPage:
            events_page = paginator.page(paginator.num_pages)
            page = paginator.num_pages
        
        # Serialize the events
        serializer = EventSerializerFull(events_page, many=True)
        
        # Prepare response data
        response_data = {
            'events': serializer.data,
            'pagination': {
                'current_page': page,
                'page_size': page_size,
                'total_pages': total_pages,
                'total_count': total_count,
                'has_next': events_page.has_next(),
                'has_previous': events_page.has_previous(),
                'next_page': page + 1 if events_page.has_next() else None,
                'previous_page': page - 1 if events_page.has_previous() else None,
            },
            'filters': {
                'search': search,
                'sort_by': sort_by,
                'available_sort_options': list(sort_mapping.keys())
            }
        }
        
        return Response(response_data, status=200)
        
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)


# Optional: Add a helper view to get available sort options
@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_sort_options(request):
    """
    Returns available sorting options for the events API
    """
    sort_options = {
        'newest': 'Newest First',
        'oldest': 'Oldest First', 
        'name_asc': 'Name A-Z',
        'name_desc': 'Name Z-A',
        'date_early': 'Start Date (Early)',
        'date_late': 'Start Date (Late)'
    }
    
    return Response({
        'sort_options': sort_options,
        'default': 'newest'
    }, status=200)


@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_pending_events(request):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
    
    try:
        # Get query parameters
        page = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 10)  # Default to 10 events per page
        search = request.GET.get('search', '')
        sort_by = request.GET.get('sort_by', '-created_at')  # Default sort by newest first
        
        # Convert to integers
        try:
            page = int(page)
            page_size = int(page_size)
        except ValueError:
            return Response({'error': 'Invalid page or page_size parameter'}, status=400)
        
        # Limit page_size to prevent abuse
        if page_size > 100:
            page_size = 100
        
        # Start with all events
        events_queryset = Event.objects.filter(delivery_status='pending')

        
        # Apply search filter if provided
        if search:
            events_queryset = events_queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(location__icontains=search)
            )
        
        # Apply sorting
        valid_sort_fields = ['created_at', '-created_at', 'title', '-title', 'date', '-date']
        if sort_by in valid_sort_fields:
            events_queryset = events_queryset.order_by(sort_by)
        else:
            events_queryset = events_queryset.order_by('-created_at')
        
        # Create paginator
        paginator = Paginator(events_queryset, page_size)
        total_pages = paginator.num_pages
        total_count = paginator.count
        
        try:
            events_page = paginator.page(page)
        except PageNotAnInteger:
            events_page = paginator.page(1)
            page = 1
        except EmptyPage:
            events_page = paginator.page(paginator.num_pages)
            page = paginator.num_pages
        
        # Serialize the events
        serializer = EventSerializerFull(events_page, many=True)
        
        # Prepare response data
        response_data = {
            'events': serializer.data,
            'pagination': {
                'current_page': page,
                'page_size': page_size,
                'total_pages': total_pages,
                'total_count': total_count,
                'has_next': events_page.has_next(),
                'has_previous': events_page.has_previous(),
                'next_page': page + 1 if events_page.has_next() else None,
                'previous_page': page - 1 if events_page.has_previous() else None,
            },
            'filters': {
                'search': search,
                'sort_by': sort_by
            }
        }
        
        return Response(response_data, status=200)
        
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)

# ALTERNATIVE: Offset-based pagination (if you prefer this approach)
@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_events_offset(request):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
    
    try:
        # Get query parameters
        offset = int(request.GET.get('offset', 0))
        limit = int(request.GET.get('limit', 10))
        search = request.GET.get('search', '')
        sort_by = request.GET.get('sort_by', '-created_at')
        
        # Limit the limit to prevent abuse
        if limit > 100:
            limit = 100
        
        # Start with all events
        events_queryset = Event.objects.all()
        # Apply search filter if provided
        if search:
            events_queryset = events_queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(location__icontains=search)
            )
        
        # Apply sorting
        valid_sort_fields = ['created_at', '-created_at', 'title', '-title', 'date', '-date']
        if sort_by in valid_sort_fields:
            events_queryset = events_queryset.order_by(sort_by)
        else:
            events_queryset = events_queryset.order_by('-created_at')
        
        # Get total count
        total_count = events_queryset.count()
        
        # Apply offset and limit
        events = events_queryset[offset:offset + limit]
        
        # Serialize the events
        serializer = EventSerializerFull(events, many=True)
        
        # Calculate if there are more items
        has_next = (offset + limit) < total_count
        
        # Prepare response data
        response_data = {
            'events': serializer.data,
            'pagination': {
                'offset': offset,
                'limit': limit,
                'total_count': total_count,
                'has_next': has_next,
                'next_offset': offset + limit if has_next else None,
            },
            'filters': {
                'search': search,
                'sort_by': sort_by
            }
        }
        
        return Response(response_data, status=200)
        
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)





@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_user(request):
        email =request.GET.get('email',None)
        if not request.user.is_superuser:
        
            return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
        if email is None:
            return Response({'error': 'Email parameter is required.'}, status=400)

        try :
            user=CustomUser.objects.get(email=request.GET.get('email',None))
            serializer = UserSerializer2(user)
            
            return Response({"message":"success","user":serializer.data},status=200)


        except Exception as e:
            return Response ({"message":"user not found","details":e.args},status=400)

    

@api_view(['POST'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def change_event_status(request):
    statuses = ['pending','delivered','cancelled','pending payment']
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
    
    try:
        event_id = request.data.get('event_id')
        new_status = request.data.get('new_status')
        if new_status not in statuses:
            return Response({'error': 'Invalid status'}, status=400)
        
        event = Event.objects.get(event_id=event_id)
        event.delivery_status = new_status
        event.save()
        
        return Response({'message': 'Event status updated successfully'}, status=200)
    
    
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)

@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_event_transaction(request):
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
    
    try:
        event_id = request.GET.get('event_id')
        event = Event.objects.get(event_id=event_id)
        transaction = Transaction.objects.get(event_id=event_id)
        serializer = TransactionSerializer(transaction)
        return Response({'message': 'Event transaction retrieved successfully', 'transaction': serializer.data}, status=200)
    
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)
    
# Optional: Enhanced version with additional filters
@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    """
    Advanced transactions endpoint with multiple status filtering
    """
    if not request.user.is_superuser:
        return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
    
    try:
        # Get query parameters
        page = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 10)
        search = request.GET.get('search', '')
        sort_by = request.GET.get('sort_by', 'newest')
        status_filter = request.GET.get('status', 'successful')  # successful, failed, pending, all
        date_from = request.GET.get('date_from')  # YYYY-MM-DD format
        date_to = request.GET.get('date_to')      # YYYY-MM-DD format
        
        # Convert to integers
        try:
            page = int(page)
            page_size = int(page_size)
        except ValueError:
            return Response({'error': 'Invalid page or page_size parameter'}, status=400)
        
        if page_size > 100:
            page_size = 100
        
        # Sort mapping
        sort_mapping = {
            'newest': '-created_at',
            'oldest': 'created_at',
            'amount_high': '-amount',
            'amount_low': 'amount',
            'customer_asc': 'customer_name',
            'customer_desc': '-customer_name',
        }
        
        # Start with all transactions or filter by status
        if status_filter == 'all':
            transactions_queryset = Transaction.objects.all()
        else:
            transactions_queryset = Transaction.objects.filter(status=status_filter)
        
        # Apply date filters
        if date_from:
            try:
                from_date = datetime.strptime(date_from, '%Y-%m-%d').date()
                transactions_queryset = transactions_queryset.filter(created_at__date__gte=from_date)
            except ValueError:
                return Response({'error': 'Invalid date_from format. Use YYYY-MM-DD'}, status=400)
        
        if date_to:
            try:
                to_date = datetime.strptime(date_to, '%Y-%m-%d').date()
                transactions_queryset = transactions_queryset.filter(created_at__date__lte=to_date)
            except ValueError:
                return Response({'error': 'Invalid date_to format. Use YYYY-MM-DD'}, status=400)
        
        # Apply search filter
        if search:
            transactions_queryset = transactions_queryset.filter(
                Q(customer_name__icontains=search) |
                Q(customer_email__icontains=search) |
                Q(transaction_reference__icontains=search) |
                Q(payment_reference__icontains=search) |
                Q(event_id__icontains=search)
            )
        
        # Apply sorting
        if sort_by in sort_mapping:
            transactions_queryset = transactions_queryset.order_by(sort_mapping[sort_by])
        else:
            transactions_queryset = transactions_queryset.order_by('-created_at')
        
        # Pagination
        paginator = Paginator(transactions_queryset, page_size)
        total_pages = paginator.num_pages
        total_count = paginator.count
        
        try:
            transactions_page = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            transactions_page = paginator.page(1)
            page = 1
        
        # Serialize
        serializer = TransactionSerializer(transactions_page, many=True)
        
        # Response
        response_data = {
            'message': f'{status_filter.title()} transactions retrieved successfully',
            'transactions': serializer.data,
            'pagination': {
                'current_page': page,
                'page_size': page_size,
                'total_pages': total_pages,
                'total_count': total_count,
                'has_next': transactions_page.has_next(),
                'has_previous': transactions_page.has_previous(),
            },
            'filters': {
                'search': search,
                'sort_by': sort_by,
                'status': status_filter,
                'date_from': date_from,
                'date_to': date_to,
            }
        }
        
        return Response(response_data, status=200)
        
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)