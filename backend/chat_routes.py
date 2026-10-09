import json
import os
import time
from collections.abc import Iterator

import httpx
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

import models
from ai_provider import decrypt_api_key
from auth import get_optional_user
from database import get_db

router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    context: dict = Field(default_factory=dict)


def provider_status(user: models.User | None = None, db: Session | None = None) -> dict:
    if user and db:
        config = db.query(models.AIProviderConfig).filter(
            models.AIProviderConfig.user_id == user.id,
            models.AIProviderConfig.is_active.is_(True),
        ).first()
        if config:
            return {"provider": config.provider, "mode": "live", "model": config.model, "name": config.name}
    provider = os.getenv("AI_PROVIDER", "demo").lower()
    configured = bool(os.getenv("OPENAI_API_KEY")) if provider in {"openai", "openai-compatible"} else False
    return {
        "provider": provider if configured else "demo",
        "mode": "live" if configured else "demo",
        "model": os.getenv("AI_MODEL", "gpt-4o-mini") if configured else "neuronex-demo-copilot",
    }


def demo_answer(message: str, context: dict) -> str:
    lower = message.lower()
    route = context.get("route", "the selected route")
    if "vessel" in lower or "ship" in lower:
        return (
            f"For {route}, I would compare vessel capacity, draft compatibility, estimated fuel burn, "
            "port restrictions, and ETA before recommending a vessel. In DEMO mode, live vessel availability "
            "is unavailable, so this is a decision framework rather than a live booking recommendation."
        )
    if "forecast" in lower or "rate" in lower or "price" in lower:
        return (
            f"NEURONEX DEMO analysis for {route}: the forecast workspace is ready to compare historical trends, "
            "bunker exposure, congestion, and vessel supply. No live market provider is configured, so I will "
            "not invent a current freight rate."
        )
    if "risk" in lower or "danger" in lower:
        return (
            f"For {route}, the main risk groups are market, fuel, port congestion, vessel operations, weather, "
            "and FX. DEMO mode has no live risk feed configured; connect a provider to calculate a current score."
        )
    return (
        f"I am NEURONEX AI Copilot in DEMO mode. I can help analyze {route}, vessels, ports, freight, "
        "contracts, forecasts, and risk. Ask me for a forecast, vessel comparison, route risk, or contract scenario."
    )


def live_answer(message: str, context: dict, status: dict, user: models.User | None, db: Session | None) -> str:
    config = None
    if user and db:
        config = db.query(models.AIProviderConfig).filter(
            models.AIProviderConfig.user_id == user.id,
            models.AIProviderConfig.is_active.is_(True),
        ).first()
    api_key = decrypt_api_key(config.encrypted_api_key) if config else os.getenv("OPENAI_API_KEY")
    model = status["model"]
    provider = status["provider"]
    base_url = (config.base_url if config else os.getenv("AI_BASE_URL", "https://api.openai.com/v1")).rstrip("/")
    system = (
        "You are NEURONEX AI Copilot, a maritime freight intelligence assistant. "
        "Use only the supplied application context. Never invent live prices, vessel availability, port status, "
        "or market data. State when data is unavailable. Keep answers concise and operational.\n\n"
        f"Application context: {json.dumps(context, default=str)}"
    )
    if provider == "anthropic":
        response = httpx.post(f"{base_url}/messages", headers={"x-api-key": api_key, "anthropic-version": "2023-06-01"}, json={"model": model, "max_tokens": 1200, "system": system, "messages": [{"role": "user", "content": message}]}, timeout=45)
    elif provider == "google":
        response = httpx.post(f"{base_url}/models/{model}:generateContent?key={api_key}", json={"systemInstruction": {"parts": [{"text": system}]}, "contents": [{"role": "user", "parts": [{"text": message}]}]}, timeout=45)
    else:
        response = httpx.post(f"{base_url}/chat/completions", headers={"Authorization": f"Bearer {api_key}"}, json={"model": model, "temperature": 0.2, "messages": [{"role": "system", "content": system}, {"role": "user", "content": message}]}, timeout=45)
    response.raise_for_status()
    payload = response.json()
    if provider == "anthropic":
        return payload["content"][0]["text"]
    if provider == "google":
        return payload["candidates"][0]["content"]["parts"][0]["text"]
    return payload["choices"][0]["message"]["content"]


def chunks(text: str, size: int = 28) -> Iterator[str]:
    for index in range(0, len(text), size):
        yield text[index:index + size]


def event_stream(request: ChatRequest, user: models.User | None, db: Session | None) -> Iterator[str]:
    status = provider_status(user, db)
    yield f"data: {json.dumps({'type': 'meta', **status})}\n\n"
    try:
        if status["mode"] == "live":
            answer = live_answer(request.message, request.context, status, user, db)
            source = "Configured AI provider"
        else:
            answer = demo_answer(request.message, request.context)
            source = "NEURONEX Demo Copilot"
    except (httpx.HTTPError, KeyError, ValueError) as exc:
        answer = "The configured AI provider is unavailable. No live answer was generated. Check provider settings and try again."
        source = "UNAVAILABLE"
        yield f"data: {json.dumps({'type': 'error', 'detail': str(exc)[:160]})}\n\n"

    for token in chunks(answer):
        yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
        time.sleep(0.015)
    yield f"data: {json.dumps({'type': 'done', 'source': source, 'status': 'LIVE' if status['mode'] == 'live' else 'DEMO'})}\n\n"


@router.get("/chat/status")
def chat_status(user: models.User | None = Depends(get_optional_user), db: Session = Depends(get_db)):
    return provider_status(user, db)


@router.post("/chat/stream")
def chat_stream(request: ChatRequest, user: models.User | None = Depends(get_optional_user), db: Session = Depends(get_db)):
    return StreamingResponse(
        event_stream(request, user, db),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
