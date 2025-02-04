import re
from app.exceptions.podcast_exceptions import ContentProcessingException

class TextCleaner:
    @staticmethod
    def clean_text(content: str) -> str:
        try:
            # 불필요한 공백 제거
            content = re.sub(r'\s+', ' ', content)
            
            # 특수문자 및 참조 링크 제거
            content = re.sub(r'\[\d+\]', '', content)
            
            # 빈 줄 제거
            content = '\n'.join(line.strip() for line in content.split('\n') if line.strip())
            
            return content.strip()
        except Exception as e:
            raise ContentProcessingException(f"Failed to clean text: {str(e)}")
