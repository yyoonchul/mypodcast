class PodcastException(Exception):
    """기본 팟캐스트 관련 예외 클래스"""
    pass

class InvalidURLException(PodcastException):
    """유효하지 않은 URL 예외"""
    def __init__(self, message="Invalid NamuWiki URL"):
        self.message = message
        super().__init__(self.message)

class ScrapingException(PodcastException):
    """스크래핑 실패 예외"""
    def __init__(self, message="Failed to scrape content"):
        self.message = message
        super().__init__(self.message)

class ContentProcessingException(PodcastException):
    """콘텐츠 처리 실패 예외"""
    def __init__(self, message="Failed to process content"):
        self.message = message
        super().__init__(self.message)

class AudioGenerationException(PodcastException):
    """오디오 생성 실패 예외"""
    def __init__(self, message="Failed to generate audio"):
        self.message = message
        super().__init__(self.message) 