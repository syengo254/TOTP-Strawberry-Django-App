from typing import Optional
from django_otp.plugins.otp_totp.admin import TOTPDeviceAdmin
from django.contrib.admin.sites import AdminSite
import strawberry
import strawberry_django

from base64 import b32encode

from django.contrib.auth.models import User

from django_otp.plugins.otp_totp.models import TOTPDevice

from api.graphql.utils import get_user_totp_device, is_user_two_fa_enabled


@strawberry_django.type(User)
class UserType:
    id: strawberry.ID
    username: str
    first_name: str
    last_name: str
    email: str
    first_name: str
    active: bool

    @strawberry_django.field
    def two_fa_enabled(self, info) -> bool:
        return is_user_two_fa_enabled(self)

    @strawberry.field
    def two_factor_authenticated(self, info) -> bool:
        user = info.context.request.user
        return user.is_authenticated and info.context.request.session.get(
            "fa_authenticated", False
        )

    @strawberry_django.field
    def totp_device(self, info) -> Optional["TOTPDeviceType"]:
        return get_user_totp_device(info.context.request.user)


@strawberry_django.type(TOTPDevice)
class TOTPDeviceType:
    id: strawberry.ID
    user: UserType
    name: str
    confirmed: bool

    @strawberry_django.field
    def key(self, info) -> str:
        return b32encode(self.bin_key).decode("utf-8")

    @strawberry_django.field
    def qr_code(self, info) -> str:
        return f"qrcode/{self.id}/"
