import openai
import json
import logging
from app.exceptions.podcast_exceptions import ContentProcessingException

class ScriptMaker:
    def __init__(self, api_key: str):
        openai.api_key = api_key
        self.logger = logging.getLogger(__name__)

    def generate_script(self, title: str, content: str) -> str:

        try:
            self.logger.info(f"Starting script generation for title: {title}")
            client = openai.OpenAI()

            # 1. 초기 대화: 원문 전체를 포함하여 테이블 오브 콘텐츠(목차) 생성에 필요한 정보를 제공
            initial_messages = [
                {
                    "role": "system",
                    "content": "너는 전문 팟캐스트 스크립트 작가이자 콘텐츠 연출 전문가야."
                },
                {
                    "role": "user",
                    "content": f"제목과 원문 전체 내용:\n\n제목: {title}\n\n내용: {content}\n\n이 내용을 기억해."
                }
            ]

            # 2. 목차 생성 요청 (목차는 JSON 형식으로 출력하도록 요청)
            prompt_toc = (
                "위에서 제공한 원문 내용을 바탕으로, 팟캐스트 스크립트의 목차를 생성해줘.\n"
                "출력은 반드시 아래의 JSON 스키마만을 따라야 해. 다른 설명은 포함하지 말고, 오직 JSON 데이터만 출력해줘.\n\n"
                "JSON 스키마:\n"
                "```\n"
                "{\"chapters\": [\n"
                "    {\"title\": \"챕터 제목\", \"description\": \"챕터 설명\"},\n"
                "    ...\n"
                "]}\n"
                "```\n"
            )

            initial_messages.append({"role": "user", "content": prompt_toc})

            functions = [
                {
                    "name": "extract_toc",
                    "description": "원문 내용을 바탕으로 목차를 JSON 형식으로 생성합니다.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "chapters": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "title": {
                                            "type": "string",
                                            "description": "챕터 제목"
                                        },
                                        "description": {
                                            "type": "string",
                                            "description": "챕터에서 다룰 내용 요약"
                                        }
                                    },
                                    "required": ["title", "description"]
                                }
                            }
                        },
                        "required": ["chapters"]
                    }
                }
            ]

            toc_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=initial_messages,
                functions=functions,
                function_call={"name": "extract_toc"},
                temperature=0.7,
            )

            #3 목차 파싱, structured output은 function_call 필드에 arguments로 JSON 데이터를 담아 응답합니다.
            function_args = toc_response.choices[0].message.function_call.arguments

            if function_args is None:
                raise ContentProcessingException("함수 호출 응답이 없습니다.")

            toc_data = json.loads(function_args)
            chapters = toc_data.get("chapters", [])

            if not chapters:
                self.logger.error("Failed to generate table of contents")
                raise ContentProcessingException("목차 생성에 실패하였습니다.")
            
            self.logger.info(f"Successfully generated table of contents with {len(chapters)} chapters")

            full_script = []
            self.logger.info("Starting chapter script generation...")

            # 4. 이후부터는 원문 전체 내용을 다시 보내지 않고, 간단한 참조 메시지로 대체하여 토큰 사용을 줄임.
            reference_message = {
                "role": "assistant",
                "content": "참고: 이전 메시지에서 제공한 원문 전체 내용을 기억하고 있으니, 이를 바탕으로 작성해줘."
            }

            # 5. 각 챕터별 스크립트 생성 (개별 요청 시 새 conversation을 구성)
            for idx, chapter in enumerate(chapters, start=1):
                chapter_messages = [
                    {
                        "role": "system",
                        "content": "너는 전문 팟캐스트 스크립트 작가이자 콘텐츠 연출 전문가야."
                    },
                    # 원문 전체 내용 대신 간단한 참조 메시지를 사용
                    reference_message,
                    {
                        "role": "user",
                        "content": (
                            f"이전 메시지에서 제공한 원문을 참고하여, 아래 목차에 해당하는 챕터의 팟캐스트 스크립트를 작성해줘.\n\n"
                            f"챕터 {idx} 제목: {chapter['title']}\n"
                            f"챕터 {idx} 설명: {chapter['description']}\n\n"
                            "조건:\n"
                            "- 스크립트는 한국어로 작성할 것\n"
                            "- 원문의 모든 세부 정보와 소소한 재미 요소를 최대한 보존하되, 청취자가 함께 읽는 듯한 생생하고 자연스러운 흐름으로 재구성할 것\n"
                            "- 해당 챕터에서 다루는 내용이 충분히 전달되도록 자세하게 작성할 것\n"
                            "- [, ], {, } 등의 특수 기호로 감싸진 지시문을을 포함하지 말 것. 순수한 스크립트 콘텐츠만 작성할 것\n"
                            f"- {idx}번째 챕터임을 고려해서 전후 맥락에 맞는 문장으로 시작하고 맺을 것\n"
                            "- 원문의 숫자, 연도, 고유명사, 사실 관계 등 객관적인 사실과 관계를 왜곡 없이 전할 것."
                            
                        )
                    }
                ]

                chapter_response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=chapter_messages,
                    temperature=0.7,
                )

                chapter_script = chapter_response.choices[0].message.content.strip()
                full_script.append(chapter_script)
                self.logger.info(f"Completed Chapter {idx} script generation")

            self.logger.info("Successfully completed full script generation")
            return full_script
            
        except Exception as e:
            self.logger.error(f"Script generation failed: {str(e)}")
            raise ContentProcessingException(f"Failed to generate script: {str(e)}")
        