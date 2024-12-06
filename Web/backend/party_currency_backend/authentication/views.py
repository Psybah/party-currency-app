from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["POST"])
def login(request):
    return Response({"Message":" login works"})
# Create your views here.
@api_view(["POST"])
def signup(request):
    return Response({"Message":"signup works"})

@api_view(["POST"])
def test(request):
    return Response({"Message":" test works"})