from fastapi import APIRouter, HTTPException
from fastapi.responses import  FileResponse
from app.models.podcast import PodcastRequest, PodcastResponse, ScriptRequest
from app.services.namuwiki_scrape import NamuWikiScraper
from app.services.namuwiki_data_extract import TextCleaner
from app.services.script_maker import ScriptMaker
from app.services.audio_maker import AudioMaker
from app.exceptions.podcast_exceptions import (
    PodcastException,
    InvalidURLException,
    ScrapingException,
    ContentProcessingException,
)
from app.services.podcast_maker import PodcastMaker
import os
import logging
from dotenv import load_dotenv

# 로그 핸들러 설정
logger = logging.getLogger()

router = APIRouter()

load_dotenv()
script_maker = ScriptMaker(os.getenv("OPENAI_API_KEY"))
audio_maker = AudioMaker([os.getenv("ELEVEN_LABS_API_KEY"), os.getenv("OPENAI_API_KEY")], 2) # 1: elevenlabs, 2: openai
podcast_maker = PodcastMaker(script_maker, audio_maker)

@router.post("/podcast", response_model=PodcastResponse)
async def create_podcast(request: PodcastRequest):
    try:
        # URL 검증
        if not NamuWikiScraper.validate_url(str(request.url)):
            raise InvalidURLException()
        
        try:
            # 콘텐츠 스크래핑
            title, raw_content = NamuWikiScraper.scrape_content(str(request.url))
        except Exception as e:
            raise ScrapingException(f"Failed to scrape content: {str(e)}")
        
        try:
            # 텍스트 전처리
            cleaned_content = TextCleaner.clean_text(raw_content)
        except Exception as e:
            raise ContentProcessingException(f"Failed to process content: {str(e)}")
        
        # 스크립트 생성 (현재는 전처리된 콘텐츠를 그대로 반환)
        script = cleaned_content
        
        return PodcastResponse(
            title=title,
            content=script,
            status="success"
        )
        
    except PodcastException as e:
        return PodcastResponse(
            title="",
            content="",
            status="error",
            error=str(e.message)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create_podcast")
async def create_full_podcast(request: ScriptRequest):
    try:
        podcast_path = podcast_maker.create_podcast(request.title, request.content)
        
        return FileResponse(
            path=podcast_path,
            media_type="audio/mpeg",
            filename=os.path.basename(podcast_path)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


