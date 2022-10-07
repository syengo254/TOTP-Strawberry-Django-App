import strawberry
from .queries import Query
from .mutations import UserMutations
from strawberry.tools import merge_types


Mutation = merge_types("Mutation", (UserMutations,))
schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)
