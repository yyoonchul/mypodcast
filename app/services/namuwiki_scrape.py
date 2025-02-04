import requests
from bs4 import BeautifulSoup, Tag
from typing import Tuple, Optional
from app.exceptions.podcast_exceptions import InvalidURLException, ScrapingException

class NamuWikiScraper:
    @staticmethod
    def validate_url(url: str) -> bool:
        if not url.startswith("https://namu.wiki/"):
            raise InvalidURLException("URL must start with 'https://namu.wiki/'")
        return True

    @staticmethod
    def scrape_content(url: str) -> Tuple[str, str]:
        try:
            # HTTP 요청
            response = requests.get(url)
            response.raise_for_status()
            
            # BeautifulSoup 객체 생성
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # og:title 메타 태그에서 제목 추출
            title_meta = soup.find('meta', property='og:title')
            if not title_meta:
                raise ValueError("Title meta tag not found")
            title = title_meta['content'].strip()

            # 본문 내용 추출
            content_div = soup.find('div', class_='ndDq6gtT jDOGykqY')
            if not content_div:
                raise ValueError("Main content div not found")
            
            # 두 클래스에 해당하는 모든 div 찾기
            content_divs = content_div.find_all('div', class_=['c0JwjYul +UZZK0Af', 'cPIcBa-P _1qJ2Vzes'])
            if not content_divs:
                raise ValueError("Content divs not found")
            
            # 각 div의 내용을 저장할 리스트
            contents = []
            
            # 각 div에서 콘텐츠 추출
            for div in content_divs:
                if not isinstance(div, Tag):
                    continue
                
                # 광고 제거
                for ad in div.find_all('div', class_='yzOgysK4'):
                    ad.decompose()
                
                try:
                    div_content = div.get_text(separator='\n', strip=True)
                    if div_content:
                        contents.append(div_content)
                except AttributeError:
                    continue
            
            if not contents:
                raise ValueError("Content extraction failed")
            
            # 모든 콘텐츠를 하나의 문자열로 결합
            final_content = '\n\n'.join(contents)
            
            return title, str(final_content)
            
        except requests.RequestException as e:
            raise ScrapingException(f"Failed to fetch content: {str(e)}")
        except Exception as e:
            raise ScrapingException(f"Failed to scrape content: {str(e)}")
