from typing import Any
from sqlmodel import select
from app.api.deps import SessionDep

def get_user(session: SessionDep, email: str) -> Any:
    # user = session.exec(select(User).where(User.email == email)).first()
    # return user
    ...