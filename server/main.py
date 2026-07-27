# server/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional

from auth import hash_password, verify_password, generate_temp_password, send_sms_temp_password

app = FastAPI()

# 프론트엔드 연동을 위한 CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DTO (Pydantic Models) ---
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

# 1️⃣ 회원가입 API
@app.post("/api/auth/signup")
def signup(req: SignUpReq):
    # TODO: DB 중복 체크 (username, email, phone)
    hashed_pw = hash_password(req.password)
    # TODO: DB 저장
    return {"message": "회원가입이 완료되었습니다."}

# 2️⃣ 로그인 API
@app.post("/api/auth/login")
def login(req: LoginReq):
    # TODO: DB에서 사용자 조회 및 비밀번호 검증(verify_password)
    return {
        "access_token": "mock-jwt-token-sample",
        "token_type": "bearer",
        "user": {"username": req.username, "name": "홍길동"}
    }

# 3️⃣ 비밀번호 초기화 & SMS 발송 API
@app.post("/api/auth/reset-password")
def reset_password(req: ResetPwReq):
    # TODO: DB에서 이름과 전화번호가 일치하는 사용자 찾기
    temp_pw = generate_temp_password()
    hashed_pw = hash_password(temp_pw)
    
    # DB 비밀번호 업데이트 후 SMS 문자 발송
    send_sms_temp_password(req.phone, temp_pw)
    
    return {"message": "임시 비밀번호가 입력하신 연락처로 발송되었습니다."}

# 4️⃣ 회원정보 수정 API
@app.put("/api/users/me")
def update_profile(req: UpdateUserReq):
    # TODO: 토큰 검증 후 회원 데이터 변경
    return {"message": "회원정보가 수정되었습니다."}

# 5️⃣ 회원 탈퇴 API
@app.delete("/api/users/me")
def delete_account():
    # TODO: DB에서 사용자 삭제
    return {"message": "회원 탈퇴가 완료되었습니다."}

# 6️⃣ 카카오/네이버/구글 SSO 콜백 엔드포인트 구역
@app.get("/api/auth/sso/{provider}")
def sso_login(provider: str, code: str):
    # TODO: 소셜 Provider 인증 코드로 토큰 요청 및 사용자 정보 획득/가입
    return {"message": f"{provider} 로그인 완료"}