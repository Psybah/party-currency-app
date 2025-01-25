from django.shortcuts import render
from  rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from rest_framework.permissions import IsAuthenticated,AllowAny



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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def editUser(request):
     user = request.user
     
@api_view(["PUT"])
def update_picture(request):
     user = request.user
     if 'profile_picture' not in request.FILES:
          return Response({"error": "No profile picture provided"}, status=400)
     
     profile_picture = request.FILES['profile_picture']
     user.profile_picture.save(profile_picture.name, profile_picture)
     user.save()
     
     return Response({"message": "Profile picture updated successfully"})
@api_view(["GET"])
def get_picture(request):
    user = request.user
    if not user.profile_picture:
        return Response({"error": "No profile picture"}, status=404)
    
    return Response({
        "profile_picture_url": user.profile_picture.url
    })