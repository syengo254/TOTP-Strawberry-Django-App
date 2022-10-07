import strawberry
import strawberry_django

from base64 import b32encode

from django.contrib.auth.models import User

from django_otp.plugins.otp_totp.models import TOTPDevice


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
        user_device = TOTPDevice.objects.filter(user=self).first()
        enabled = user_device.confirmed if user_device else False
        return enabled

    @strawberry_django.field
    def totp_device(self, info) -> "TOTPDeviceType":
        device = self.objects.device__set.first()
        if not device.id:
            device = TOTPDevice.objects.none()
        return device


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
        return f"admin/oto_totp/totpdevice/{self.id}/qrcode/"
