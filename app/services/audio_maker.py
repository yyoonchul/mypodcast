import os
import re
from datetime import datetime
import logging
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
from app.exceptions.podcast_exceptions import AudioGenerationException
from pathlib import Path
import openai

class AudioMaker:
    def __init__(self, api_key_list: list[str], model: int):
        # 1: elevenlabs, 2: openai
        self.model = model
        api_key = api_key_list[model-1]

        if not api_key:
            raise ValueError("API key is not provided")
        if model == 1:
            self.client = ElevenLabs(api_key=api_key)
        elif model == 2:
            openai.api_key = api_key
            self.client = openai.OpenAI()
        else:
            raise ValueError("TTS model is not selected")

        self.audio_dir = "generated/audio"
        os.makedirs(self.audio_dir, exist_ok=True)
        self.logger = logging.getLogger(__name__)

    def generate_audio(self, title: str, script: str) -> str:

        if self.model == 1:
            self.logger.info("TTS model selected: elevenlabs")
            return self.generate_audio_elevenlabs(title, script)
        elif self.model == 2:
            self.logger.info("TTS model selected: openai")
            return self.generate_audio_openai(title, script)
        else:
            raise ValueError("TTS model is not selected")
        
    def generate_audio_openai(self, title: str, script: str) -> str:

        try:
            if not script or not title:
                raise ValueError("Empty script or title provided")
            
            self.logger.info(f"Starting audio generation for: {title}")
            
            # 타이틀을 파일명에 사용할 수 있도록 특수문자 제거 및 공백은 언더바(_)로 치환
            sanitized_title = re.sub(r'[^\w\s-]', '', title.strip())
            sanitized_title = re.sub(r'\s+', '_', sanitized_title)
            
            # 현재 생성 일시 (YYYYMMDD_HHMMSS 형식)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{sanitized_title}_{timestamp}.mp3"
            filepath = os.path.join(self.audio_dir, filename)

            self.logger.info("Converting text to speech...")
            # TTS 변환 및 파일 저장

            response = self.client.audio.speech.create(
                model="tts-1",
                voice="nova",
                input=script,
            )

            self.logger.info(f"Saving audio file to: {filepath}")

            with open(filepath, "wb") as f:
                f.write(response.content)

            if not os.path.exists(filepath):
                self.logger.error("Failed to save audio file")
                raise AudioGenerationException("Failed to save audio file")
            
            self.logger.info("Audio generation completed successfully")
            return filepath

        except Exception as e:
            self.logger.error(f"Audio generation failed: {str(e)}")
            raise AudioGenerationException(f"Failed to generate audio: {str(e)}")
        
    def generate_audio_elevenlabs(self, title: str, script: str) -> str:

        try:
            if not script or not title:
                raise ValueError("Empty script or title provided")
            
            self.logger.info(f"Starting audio generation for: {title}")
            
            # 타이틀을 파일명에 사용할 수 있도록 특수문자 제거 및 공백은 언더바(_)로 치환
            sanitized_title = re.sub(r'[^\w\s-]', '', title.strip())
            sanitized_title = re.sub(r'\s+', '_', sanitized_title)
            
            # 현재 생성 일시 (YYYYMMDD_HHMMSS 형식)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{sanitized_title}_{timestamp}.mp3"
            filepath = os.path.join(self.audio_dir, filename)

            self.logger.info("Converting text to speech...")
            # TTS 변환 및 파일 저장
            response = self.client.text_to_speech.convert(
                voice_id="DMkRitQrfpiddSQT5adl",  # jjeong voice
                output_format="mp3_44100_128",
                text=script,
                model_id="eleven_multilingual_v2",
                voice_settings=VoiceSettings(
                    stability=0.5,
                    similarity_boost=0.75,
                    style=0.0,
                    use_speaker_boost=True,
                )
            )

            self.logger.info(f"Saving audio file to: {filepath}")
            # 파일 저장: response는 청크 iterable로 반환됨
            with open(filepath, "wb") as f:
                for chunk in response:
                    if chunk:
                        f.write(chunk)

            if not os.path.exists(filepath):
                self.logger.error("Failed to save audio file")
                raise AudioGenerationException("Failed to save audio file")
            
            self.logger.info("Audio generation completed successfully")
            return filepath

        except Exception as e:
            self.logger.error(f"Audio generation failed: {str(e)}")
            raise AudioGenerationException(f"Failed to generate audio: {str(e)}")
        