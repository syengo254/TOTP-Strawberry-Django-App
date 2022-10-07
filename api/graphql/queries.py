from typing import Optional
import strawberry

from ._types import TOTPDeviceType, UserType

from django_otp.plugins.otp_totp.models import TOTPDevice


@strawberry.type
class LoggedInUser:
    logged_in: bool
    user: Optional[UserType]


@strawberry.type
class Query:
    @strawberry.field
    def user_device(self, info) -> Optional[TOTPDeviceType]:
        user = info.context.request.user
        if user.is_authenticated:
            device = TOTPDevice.objects.filter(user=user).first()
            return device
        return None

    @strawberry.field
    def is_user_loggedIn(self, info) -> LoggedInUser:
        user = info.context.request.user
        logged_in = user.is_authenticated

        return LoggedInUser(logged_in=logged_in, user=(user if logged_in else None))
