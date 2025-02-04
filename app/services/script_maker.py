import openai
from app.exceptions.podcast_exceptions import ContentProcessingException

class ScriptMaker:
    def __init__(self, api_key: str):
        openai.api_key = api_key

    @staticmethod
    def generate_script(title: str, content: str) -> str:
        try:
            client = openai.OpenAI()
            prompt = (
                "아래의 제목과 텍스트를 기반으로, 원문의 모든 세부 내용과 재미 요소들을 놓치지 않으면서도, "
                "팟캐스트 스크립트 형식에 맞게 자연스럽게 재구성해줘.\n\n"
                "주어진 텍스트를 분석하여 문서의 주요 내용, 진행 방식 및 목차를 상세하게 구성해. "
                "이때 원문의 세부 내용과 흐름이 모두 반영되도록 목차 항목을 정리해줘.\n\n"
                "조건:\n"
                "- 스크립트는 한국어로 작성할 것\n"
                "- TTS 모델에 입력할 것이므로, 실제 청취자가 듣는 느낌으로 읽기 좋은 형태로 작성할 것\n"
                "- 원문의 전체 내용을 포함하되, 단순 암송이 아니라 팟캐스트 진행에 맞게 적절히 재구성할 것\n"
                "  (예: 목소리의 톤, 감정, 강조점 등을 고려하여 표현하며, 필요한 경우 문장 구조를 변경하거나 "
                "  적절한 연결어를 추가해 자연스러운 흐름을 만들 것)\n\n"
                f"제목: {title}\n"
                f"내용: {content}\n\n"
                "위 조건에 맞춰 팟캐스트 스크립트를 작성해줘."
            )

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "너는 전문 팟캐스트 스크립트 작가이자 콘텐츠 분석 전문가야."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
            )
            
            script = response.choices[0].message.content.strip()
            return script
            
        except Exception as e:
            raise ContentProcessingException(f"Failed to generate script: {str(e)}")