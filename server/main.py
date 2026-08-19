# server/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from database import engine, get_db, Base
import models
from auth import hash_password, verify_password, generate_temp_password, send_sms_temp_password

# 데이터베이스 테이블 자동 생성
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DTO
class SignUpReq(BaseModel):
    username: str
    password: str
    name: str
    email: str
    phone: str

class LoginReq(BaseModel):
    username: str
    password: str

class ResetPwReq(BaseModel):
    name: str
    phone: str

class UpdateUserReq(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None

# 1️⃣ 회원가입 (실제 DB 저장)
@app.post("/api/auth/signup")
def signup(req: SignUpReq, db: Session = Depends(get_db)):
    # 중복 체크
    exist_user = db.query(models.User).filter(
        (models.User.username == req.username) | (models.User.email == req.email)
    ).first()
    if exist_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디 또는 이메일입니다.")

    new_user = models.User(
        username=req.username,
        hashed_password=hash_password(req.password),
        name=req.name,
        email=req.email,
        phone=req.phone
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "회원가입이 완료되었습니다."}

# 2️⃣ 로그인 (DB 검증)
@app.post("/api/auth/login")
def login(req: LoginReq, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == req.username).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="아이디 또는 비밀번호가 올바르지 않습니다.")

    return {
        "access_token": f"mock-token-for-{user.id}",
        "token_type": "bearer",
        "user": {"username": user.username, "name": user.name, "email": user.email, "phone": user.phone}
    }

# 3️⃣ 비밀번호 초기화 (DB 무작위 임시 비번 업데이트)
@app.post("/api/auth/reset-password")
def reset_password(req: ResetPwReq, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.name == req.name,
        models.User.phone == req.phone
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="일치하는 사용자 정보를 찾을 수 없습니다.")

    temp_pw = generate_temp_password()
    user.hashed_password = hash_password(temp_pw)
    db.commit()

    send_sms_temp_password(req.phone, temp_pw)
    return {"message": "임시 비밀번호가 입력하신 연락처로 발송되었습니다."}

# 4️⃣ 회원정보 수정 (DB 업데이트)
@app.put("/api/users/me")
def update_profile(req: UpdateUserReq, db: Session = Depends(get_db)):
    # 테스트용: 첫 번째 유저 수정 (추후 JWT 토큰 추출 정보로 대체)
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")

    if req.name: user.name = req.name
    if req.email: user.email = req.email
    if req.phone: user.phone = req.phone
    if req.password: user.hashed_password = hash_password(req.password)

    db.commit()
    return {"message": "회원정보가 수정되었습니다."}

# 5️⃣ 회원 탈퇴 (DB 삭제)
@app.delete("/api/users/me")
def delete_account(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if user:
        db.delete(user)
        db.commit()
    return {"message": "회원 탈퇴가 완료되었습니다."}

# 6️⃣ SSO 엔드포인트
@app.get("/api/auth/sso/{provider}")
def sso_login(provider: str, code: Optional[str] = None):
    return {
        "message": f"{provider} 소셜 로그인 테스트 성공!",
        "provider": provider
    }