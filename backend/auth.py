import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session as DatabaseSession

from database import get_db
from models import Session, User

PASSWORD_SCHEME = "scrypt"
SESSION_TTL_DAYS = 7


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=16384,
        r=8,
        p=1,
    )
    return f"{PASSWORD_SCHEME}${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded_password: str) -> bool:
    try:
        scheme, salt_hex, digest_hex = encoded_password.split("$", 2)
        if scheme != PASSWORD_SCHEME:
            return False
        expected = bytes.fromhex(digest_hex)
        actual = hashlib.scrypt(
            password.encode("utf-8"),
            salt=bytes.fromhex(salt_hex),
            n=16384,
            r=8,
            p=1,
        )
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def create_session_token() -> tuple[str, str, datetime]:
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_TTL_DAYS)
    return token, token_hash, expires_at


def get_current_user(
    authorization: str | None = Header(default=None),
    db: DatabaseSession = Depends(get_db),
) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Sign in to manage AI providers.")
    token = authorization.split(" ", 1)[1].strip()
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    session = db.query(Session).filter(Session.token_hash == token_hash).first()
    expires_at = session.expires_at.replace(tzinfo=timezone.utc) if session and session.expires_at.tzinfo is None else session.expires_at if session else None
    if not session or expires_at <= datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Your session has expired. Sign in again.")
    user = db.query(User).filter(User.id == session.user_id, User.is_active.is_(True)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User account is unavailable.")
    return user


def get_optional_user(
    authorization: str | None = Header(default=None),
    db: DatabaseSession = Depends(get_db),
) -> User | None:
    if not authorization:
        return None
    try:
        return get_current_user(authorization=authorization, db=db)
    except HTTPException:
        return None
