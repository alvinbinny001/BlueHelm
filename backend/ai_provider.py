import base64
import hashlib
import os

from cryptography.fernet import Fernet

SUPPORTED_PROVIDERS = {"openai", "openai-compatible", "anthropic", "google"}


def _cipher() -> Fernet:
    secret = os.getenv("AI_CONFIG_ENCRYPTION_KEY") or os.getenv("SESSION_SECRET") or "neuronex-development-key"
    key = base64.urlsafe_b64encode(hashlib.sha256(secret.encode("utf-8")).digest())
    return Fernet(key)


def encrypt_api_key(api_key: str) -> str:
    return _cipher().encrypt(api_key.encode("utf-8")).decode("ascii")


def decrypt_api_key(value: str) -> str:
    return _cipher().decrypt(value.encode("ascii")).decode("utf-8")


def mask_api_key(api_key: str) -> str:
    if len(api_key) <= 8:
        return "••••••••"
    return f"{api_key[:4]}…{api_key[-4:]}"


def default_base_url(provider: str) -> str | None:
    return {
        "openai": "https://api.openai.com/v1",
        "anthropic": "https://api.anthropic.com/v1",
        "google": "https://generativelanguage.googleapis.com/v1beta",
    }.get(provider)
