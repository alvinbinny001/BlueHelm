from datetime import datetime
import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
import models
from database import get_db
import ml_model
from auth import create_session_token, get_current_user, hash_password, verify_password
from ai_provider import SUPPORTED_PROVIDERS, default_base_url, encrypt_api_key, mask_api_key

router = APIRouter()

class OptimizationInput(BaseModel):
    feature_1: float
    feature_2: float
    feature_3: float

class OptimizationResponse(BaseModel):
    id: int
    prediction_result: float


class OptimizationHistoryItem(OptimizationResponse):
    feature_1: float
    feature_2: float
    feature_3: float
    created_at: datetime


class SignupInput(BaseModel):
    full_name: str
    email: str
    password: str


class LoginInput(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class AIProviderInput(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    provider: str
    model: str = Field(min_length=1, max_length=120)
    api_key: str = Field(min_length=1, max_length=4000)
    base_url: str | None = Field(default=None, max_length=500)


def provider_payload(config: models.AIProviderConfig, api_key: str | None = None) -> dict:
    return {
        "id": config.id,
        "name": config.name,
        "provider": config.provider,
        "model": config.model,
        "base_url": config.base_url,
        "api_key": mask_api_key(api_key) if api_key else "••••••••",
        "is_active": config.is_active,
    }


def normalize_email(email: str) -> str:
    normalized = email.strip().lower()
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", normalized):
        raise HTTPException(status_code=422, detail="Enter a valid email address.")
    return normalized


def validate_password(password: str) -> None:
    if len(password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters.")


def user_payload(user: models.User) -> dict:
    return {"id": user.id, "full_name": user.full_name, "email": user.email}


@router.post("/auth/signup", response_model=AuthResponse, status_code=201)
def signup(request: SignupInput, db: Session = Depends(get_db)):
    full_name = request.full_name.strip()
    if len(full_name) < 2 or len(full_name) > 120:
        raise HTTPException(status_code=422, detail="Enter a name between 2 and 120 characters.")
    validate_password(request.password)
    email = normalize_email(request.email)

    if db.query(models.User).filter(models.User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    user = models.User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(request.password),
    )
    token, token_hash, expires_at = create_session_token()
    db.add(user)
    db.flush()
    db.add(models.Session(user_id=user.id, token_hash=token_hash, expires_at=expires_at))
    db.commit()
    db.refresh(user)
    return {"access_token": token, "user": user_payload(user)}


@router.post("/auth/login", response_model=AuthResponse)
def login(request: LoginInput, db: Session = Depends(get_db)):
    email = normalize_email(request.email)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not user.is_active or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")

    token, token_hash, expires_at = create_session_token()
    db.add(models.Session(user_id=user.id, token_hash=token_hash, expires_at=expires_at))
    db.commit()
    return {"access_token": token, "user": user_payload(user)}


@router.get("/ai/providers")
def list_ai_providers(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    configs = db.query(models.AIProviderConfig).filter(models.AIProviderConfig.user_id == user.id).order_by(models.AIProviderConfig.created_at).all()
    return {"providers": [provider_payload(config) for config in configs]}


@router.post("/ai/providers", status_code=201)
def save_ai_provider(request: AIProviderInput, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    provider = request.provider.strip().lower()
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=422, detail="Choose a supported AI provider.")
    name = request.name.strip()
    model = request.model.strip()
    if not name or not model:
        raise HTTPException(status_code=422, detail="Provider name and model are required.")
    existing = db.query(models.AIProviderConfig).filter(
        models.AIProviderConfig.user_id == user.id,
        models.AIProviderConfig.name == name,
    ).first()
    if existing:
        existing.provider = provider
        existing.model = model
        existing.base_url = request.base_url.strip().rstrip("/") if request.base_url else default_base_url(provider)
        existing.encrypted_api_key = encrypt_api_key(request.api_key.strip())
        config = existing
    else:
        config = models.AIProviderConfig(
            user_id=user.id,
            name=name,
            provider=provider,
            model=model,
            base_url=request.base_url.strip().rstrip("/") if request.base_url else default_base_url(provider),
            encrypted_api_key=encrypt_api_key(request.api_key.strip()),
            is_active=db.query(models.AIProviderConfig).filter(models.AIProviderConfig.user_id == user.id).count() == 0,
        )
        db.add(config)
    db.commit()
    db.refresh(config)
    return provider_payload(config, request.api_key.strip())


@router.post("/ai/providers/{provider_id}/activate")
def activate_ai_provider(provider_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    config = db.query(models.AIProviderConfig).filter(models.AIProviderConfig.id == provider_id, models.AIProviderConfig.user_id == user.id).first()
    if not config:
        raise HTTPException(status_code=404, detail="AI provider was not found.")
    db.query(models.AIProviderConfig).filter(models.AIProviderConfig.user_id == user.id).update({models.AIProviderConfig.is_active: False})
    config.is_active = True
    db.commit()
    return provider_payload(config)


@router.delete("/ai/providers/{provider_id}", status_code=204)
def delete_ai_provider(provider_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    config = db.query(models.AIProviderConfig).filter(models.AIProviderConfig.id == provider_id, models.AIProviderConfig.user_id == user.id).first()
    if not config:
        raise HTTPException(status_code=404, detail="AI provider was not found.")
    was_active = config.is_active
    db.delete(config)
    db.commit()
    if was_active:
        replacement = db.query(models.AIProviderConfig).filter(models.AIProviderConfig.user_id == user.id).first()
        if replacement:
            replacement.is_active = True
            db.commit()


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Confirm that the API and its persistence layer are available."""
    try:
        db.execute(text("SELECT 1"))
        saved_optimizations = db.query(models.OptimizationRequest).count()
        return {"status": "ok", "saved_optimizations": saved_optimizations}
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Database is unavailable.") from exc


@router.get("/optimize/history", response_model=list[OptimizationHistoryItem])
def optimization_history(db: Session = Depends(get_db)):
    """Return the most recent saved model results."""
    return (
        db.query(models.OptimizationRequest)
        .order_by(models.OptimizationRequest.created_at.desc())
        .limit(10)
        .all()
    )

@router.post("/optimize", response_model=OptimizationResponse)
def run_optimization(request: OptimizationInput, db: Session = Depends(get_db)):
    """
    Runs the XGBoost optimization model and saves the result to the database.
    """
    try:
        # 1. Run prediction
        prediction = ml_model.optimize(
            request.feature_1, 
            request.feature_2, 
            request.feature_3
        )
        
        # 2. Save to database
        db_record = models.OptimizationRequest(
            feature_1=request.feature_1,
            feature_2=request.feature_2,
            feature_3=request.feature_3,
            prediction_result=prediction
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        
        return {
            "id": db_record.id,
            "prediction_result": prediction
        }
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save the optimization result.",
        ) from exc
