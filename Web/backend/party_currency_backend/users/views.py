from django.shortcuts import render
from  rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from rest_framework.permissions import IsAuthenticated



# Create your views here.

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication,TokenAuthentication])
def fetchUser(request):
    user=request.user
    if (user.type == "user"):
         return Response({
              "Type":"Basic User",
                "username": user.username,
                "email": user.email,
                "firstname":user.first_name,
                "lastname":user.last_name,
                "phonenumber":user.phone_number
               
            })
    elif (user.type == "merchant"):
         return Response({
              "Type":"Merchant:"+user.business_type,
                "username": user.username,
                "email": user.email,
                "firstname":user.first_name,
                "lastname":user.last_name,
                "phonenumber":user.phone_number,
                "location":user.country+"/"+user.state+"/"+user.city,
               
            })

