from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import config
from app.core.database import get_db
from jose import jwt
from . import models, schemas, utils, dependencies

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(get_db), 
    form_data: OAuth2PasswordRequestForm = Depends(),
    remember_me: bool = False
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token = utils.create_access_token(
        data={"sub": user.email}, remember_me=remember_me
    )
    refresh_token = utils.create_refresh_token(
        data={"sub": user.email}, remember_me=remember_me
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

@router.post("/refresh", response_model=schemas.Token)
def refresh_token(
    refresh_token: str = Body(..., embed=True),
    db: Session = Depends(get_db)
) -> Any:
    """
    Refresh access token using refresh token.
    """
    try:
        payload = jwt.decode(
            refresh_token, config.settings.SECRET_KEY, algorithms=[utils.ALGORITHM]
        )
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        remember_me: bool = payload.get("remember_me", False)
        
        if email is None or token_type != "refresh":
             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
         
    access_token = utils.create_access_token(
        data={"sub": user.email}, remember_me=remember_me
    )
    # Rotate refresh token
    new_refresh_token = utils.create_refresh_token(
        data={"sub": user.email}, remember_me=remember_me
    )
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }

@router.post("/register", response_model=schemas.UserResponse)
def register_user(
    *,
    db: Session = Depends(get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = models.User(
        email=user_in.email,
        hashed_password=utils.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_superuser=user_in.is_superuser,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(
    current_user: models.User = Depends(dependencies.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.get("/users", response_model=list[schemas.UserResponse])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = db.query(models.User).filter(models.User.is_deleted == False).offset(skip).limit(limit).all()  # noqa: E712
    return users

@router.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(dependencies.get_current_active_superuser),
) -> Any:
    """
    Update a user.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_in.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = utils.get_password_hash(update_data["password"])
        del update_data["password"]
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}", response_model=schemas.UserResponse)
def delete_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    current_user: models.User = Depends(dependencies.get_current_active_superuser),
) -> Any:
    """
    Soft delete a user.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_deleted = True
    user.is_active = False # Also deactivate
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
