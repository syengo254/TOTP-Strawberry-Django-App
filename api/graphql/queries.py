import strawberry

from ._types import TOTPDeviceType


@strawberry.type
class Query:
    @strawberry.field
    def user_device(self, info) -> TOTPDeviceType:
        return info.context.request.user.totp_device
