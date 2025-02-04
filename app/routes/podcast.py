from fastapi import APIRouter, HTTPException
from app.models.podcast import PodcastRequest, PodcastResponse, ScriptRequest, ScriptResponse
from app.services.namuwiki_scrape import NamuWikiScraper
from app.services.namuwiki_data_extract import TextCleaner
from app.services.script_maker import ScriptMaker
from app.exceptions.podcast_exceptions import (
    PodcastException,
    InvalidURLException,
    ScrapingException,
    ContentProcessingException
)
import os

router = APIRouter()
script_maker = ScriptMaker(os.getenv("OPENAI_API_KEY"))

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

#스크래핑 테스트
@router.post("/scrape")
async def scrape_content(request: PodcastRequest):
    try:
        # URL 검증
        if not NamuWikiScraper.validate_url(str(request.url)):
            raise InvalidURLException()
        
        # 콘텐츠 스크래핑
        title, raw_content = NamuWikiScraper.scrape_content(str(request.url))
        
        return {
            "title": title,
            "content": raw_content,
            "status": "success"
        }
        
    except PodcastException as e:
        return {
            "status": "error",
            "error": str(e.message)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/script", response_model=ScriptResponse)
async def create_script(request: ScriptRequest):
    try:
        # 스크립트 생성
        script = script_maker.generate_script(request.title, request.content)
        
        return ScriptResponse(
            script=script,
            status="success"
        )
        
    except ContentProcessingException as e:
        return ScriptResponse(
            script="",
            status="error",
            error=str(e.message)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
