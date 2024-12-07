from django.shortcuts import render
from rest_framework.decorators import authentication_classes,permission_classes,api_view
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getCurrency(request):
    return Response("Hello World")


