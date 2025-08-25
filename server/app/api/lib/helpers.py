import uuid

def to_uuid4(id: str) -> uuid.UUID:
    return uuid.UUID(id, version=4)


def get_grouped_schedule():
    ...
