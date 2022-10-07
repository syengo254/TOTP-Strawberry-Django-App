from email.mime import message
from typing import Optional
import strawberry
from strawberry_django import mutation
from strawberry.tools import merge_types

from ._types import TOTPDeviceType, UserType
from django_otp.plugins.otp_totp.models import TOTPDevice

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout


@strawberry.type
class EnableTwoFactor:
    @mutation
    def enable_two_factor(self, info) -> TOTPDeviceType:
        user = info.context.request.user

        if user.is_authenticated:
            device, created = TOTPDevice.objects.get_or_create(
                name=f"{user.username} TOTP device", user=user
            )
            if created:
                return device
            else:
                device.confirmed = True
                device.save()
                return device
        else:
            raise Exception("User is not authenticated")


@strawberry.type
class DisableTwoFactor:
    @mutation
    def disable_two_factor(self, info) -> TOTPDeviceType:
        user = info.context.request.user
        if user.is_authenticated:
            device = TOTPDevice.objects.filter(user=user).first()
            if device:
                device.confirmed = False
                device.save()
                return device
            else:
                raise Exception("User has no TOTP device")
        else:
            raise Exception("User is not authenticated")


@strawberry.type
class LoginResult:
    user: Optional["UserType"]
    message: str


@strawberry.type
class LogoutResult:
    message: str


@strawberry.type
class UserLogin:
    @strawberry.mutation
    def user_login(self, info, username: str, password: str) -> LoginResult:
        user = User.objects.none()

        user = authenticate(info.context.request, username=username, password=password)
        if user is None:
            return LoginResult(user=user, message="Wrong username or password")

        login(info.context.request, user)
        return LoginResult(user=user, message="Login successful.")


@strawberry.type
class UserLogout:
    @strawberry.mutation
    def user_logout(self, info) -> LogoutResult:
        logout(info.context.request)
        return LogoutResult(message="Logout successful.")


UserMutations = merge_types(
    "UserMutations", (UserLogout, UserLogin, EnableTwoFactor, DisableTwoFactor)
)
