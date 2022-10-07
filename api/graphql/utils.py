from typing import Optional
from django_otp.plugins.otp_totp.models import TOTPDevice


def is_user_two_fa_enabled(user) -> bool:
    user_device = TOTPDevice.objects.filter(user=user).first()
    enabled = user_device.confirmed if user_device else False
    return enabled


def get_user_totp_device(user) -> Optional[TOTPDevice]:
    device = TOTPDevice.objects.filter(user=user).first()
    if not device.id:
        device = TOTPDevice.objects.none()
    return device
