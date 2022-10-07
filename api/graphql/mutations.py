from typing import Optional, Union
import strawberry
from strawberry.tools import merge_types

from api.graphql.utils import get_user_totp_device, is_user_two_fa_enabled

from ._types import TOTPDeviceType, UserType
from django_otp.plugins.otp_totp.models import TOTPDevice

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout


@strawberry.type
class TwoFactorResult:
    success: bool
    message: str
    created: Optional[bool] = False
    device: Optional["TOTPDeviceType"] = None


@strawberry.type
class EnableTwoFactor:
    @strawberry.mutation
    def enable_two_factor(self, info) -> TwoFactorResult:
        user = info.context.request.user

        if user.is_authenticated:
            device, created = TOTPDevice.objects.get_or_create(
                name=f"{user.username} TOTP device", user=user, confirmed=False
            )
            return TwoFactorResult(
                success=True,
                message=f"Two factor enabled for user: {user.email}",
                device=device,
                created=created,
            )
        else:
            raise Exception("User is not authenticated")


@strawberry.type
class DisableTwoFactor:
    @strawberry.mutation
    def disable_two_factor(self, info) -> TwoFactorResult:
        user = info.context.request.user
        if user.is_authenticated:
            device = TOTPDevice.objects.filter(user=user).first()
            if device:
                device.confirmed = False
                device.save()
                return TwoFactorResult(
                    device=device, message="Two factor disabled", success=True
                )
            else:
                return TwoFactorResult(message="User has no TOTP device", success=False)
        else:
            raise Exception("User is not authenticated")


@strawberry.type
class VerifyTokenResult:
    success: bool
    message: str


@strawberry.type
class VerifyToken:
    @strawberry.mutation
    def verify_token(
        self, info, token: str, setup: Optional[bool] = False
    ) -> VerifyTokenResult:
        user = info.context.request.user
        if not user.is_authenticated:
            raise Exception("User not logged in")

        device = get_user_totp_device(user)
        verified = device.verify_token(token)

        if setup and not device.confirmed:
            device.confirmed = True
            device.save()
        if verified:
            info.context.request.session["fa_authenticated"] = True
        message = "Successfully verified" if verified else "Wrong token, try again."
        return VerifyTokenResult(success=verified, message=message)


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
        if is_user_two_fa_enabled(user):
            info.context.request.session["fa_authenticated"] = False
        return LoginResult(user=user, message="Login successfull.")


@strawberry.type
class UserLogout:
    @strawberry.mutation
    def user_logout(self, info) -> LogoutResult:
        if info.context.request.session.get("fa_authenticated", False):
            info.context.request.session.pop("fa_authenticated")
        logout(info.context.request)
        return LogoutResult(message="Logout successfull.")


# ------- verify password ---------


@strawberry.type
class VerifyPasswordResult:
    success: bool
    message: str


@strawberry.type
class VerifyPassword:
    @strawberry.mutation
    def verify_password(self, info, password: str) -> VerifyPasswordResult:
        user = info.context.request.user
        if not user.is_authenticated:
            raise Exception("User not logged in")

        verified = user.check_password(password)
        device = get_user_totp_device(user)
        if device:
            device.confirmed = True
            device.save()
            info.context.request.session["fa_authenticated"] = True
        message = "Successfully verified" if verified else "Wrong password, try again."
        return VerifyPasswordResult(success=verified, message=message)


UserMutations = merge_types(
    "UserMutations",
    (
        UserLogout,
        UserLogin,
        EnableTwoFactor,
        DisableTwoFactor,
        VerifyToken,
        VerifyPassword,
    ),
)
