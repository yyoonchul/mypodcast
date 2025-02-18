from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi import Request
from app.routes import podcast
from dotenv import load_dotenv
import os
import logging

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,  # 로그 레벨 설정 (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",  # 로그 출력 형식
    handlers=[
        logging.StreamHandler(),  # 콘솔 출력
        # logging.FileHandler("app.log", encoding="utf-8"),  # 파일 저장
    ]
)

# 로거 객체 생성
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

templates = Jinja2Templates(directory="app/templates")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("podcast.html", {"request": request})

app.include_router(podcast.router, prefix="/api")
