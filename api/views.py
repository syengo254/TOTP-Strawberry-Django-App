from django.http import HttpResponse
from django.shortcuts import render

from django_otp.plugins.otp_totp.models import TOTPDevice
import qrcode
import qrcode.image.svg

# Create your views here.


def qrcode_view(request, pk):
    device = TOTPDevice.objects.get(pk=pk)
    img = qrcode.make(device.config_url, image_factory=qrcode.image.svg.SvgImage)
    response = HttpResponse(content_type="image/svg+xml")
    img.save(response)

    return response
