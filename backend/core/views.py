from rest_framework.views import APIView
from rest_framework import status
from .models import User

class RegistrationAPIView(APIView):
    pass

registration_view = RegistrationAPIView.as_view()


class LoginAPIView(APIView):
    pass 

login_view = LoginAPIView.as_view()


class LogoutAPIView(APIView):
    pass 

logout_view = LogoutAPIView.as_view()


class ChangePasswordAPIView(APIView):
    pass 

change_password_view = ChangePasswordAPIView.as_view()