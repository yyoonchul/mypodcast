from pydantic import BaseModel, HttpUrl
from typing import Optional

class PodcastRequest(BaseModel):
    url: HttpUrl

class PodcastResponse(BaseModel):
    title: str
    content: str
    status: str
    error: Optional[str] = None

class ScriptRequest(BaseModel):
    title: str
    content: str

class ScriptResponse(BaseModel):
    script: str
    status: str = "success"
    error: str = None 