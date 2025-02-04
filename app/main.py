from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi import Request
from app.routes import podcast
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

templates = Jinja2Templates(directory="app/templates")

# OpenAI API 키 설정
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("podcast.html", {"request": request})

app.include_router(podcast.router, prefix="/api")
