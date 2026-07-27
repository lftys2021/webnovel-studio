# server/auth.py
import secrets
import string
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "YOUR_SUPER_SECRET_KEY"  # 실제 운용 시 .env로 분리
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 1일

pw_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔒 비밀번호 해싱 & 검증
def hash_password(password: str) -> str:
    return pw_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pw_context.verify(plain_password, hashed_password)

# 🔑 8자리 랜덤 비밀번호 생성 (영문+숫자+특수문자)
def generate_temp_password() -> str:
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    # 최소 영문, 숫자, 특수문자 1개 이상 포함되도록 조합
    while True:
        password = ''.join(secrets.choice(chars) for _ in range(8))
        if (any(c.isalpha() for c in password) and 
            any(c.isdigit() for c in password) and 
            any(c in "!@#$%^&*" for c in password)):
            return password

# 📩 문자 메시지(SMS) 발송 전용 헬퍼 함수 (CoolSMS, Naver SENS 등 연동 구역)
def send_sms_temp_password(phone_number: str, temp_pw: str):
    print(f"==================================================")
    print(f"[SMS 발송 모의실험] 수신: {phone_number}")
    print(f"[알림] 초기화된 임시 비밀번호는 [{temp_pw}] 입니다.")
    print(f"==================================================")
    # 💡 실제 연동 시 CoolSMS / NHN Cloud / Naver Cloud SENS API 호출 코드 작성