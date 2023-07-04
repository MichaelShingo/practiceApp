from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer

from django.contrib.auth import login

from rest_framework import permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from knox.auth import TokenAuthentication
from rest_framework import status
import json
from django.http import HttpResponse


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            print('the data is valid and the user was saved')
            return Response({
                "user": UserSerializer(user, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1]
            })
        except:
            print('hello')
            data = {
                'error': 'Error, email already exists.'
            }
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
        


        # data = {
        #         'error': 'Email already exists.'
        #     }
        #     status_code = 400
        #     response = HttpResponse(content_type='application/json')
        #     response.status_code = status_code
        #     response.content = data
        #     return response

    


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)
    
class UserDetailAPIView(APIView):
    def get(self, request):
        authentication_classes = [TokenAuthentication]
        serializer_class = UserSerializer
        
        queryset = request.user
        serializer = UserSerializer(queryset)
        userData = serializer.data

        return Response(userData, status.HTTP_200_OK)