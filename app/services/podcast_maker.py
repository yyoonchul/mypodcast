import os
from datetime import datetime
import re
import logging
from typing import List
from app.services.script_maker import ScriptMaker
from app.services.audio_maker import AudioMaker
from app.exceptions.podcast_exceptions import ContentProcessingException, AudioGenerationException

class PodcastMaker:
    def __init__(self, script_maker: ScriptMaker, audio_maker: AudioMaker):
        self.script_maker = script_maker
        self.audio_maker = audio_maker
        self.podcast_dir = "generated/podcasts"
        self.script_dir = "generated/script"  # 최종 스크립트 저장 폴더
        # 팟캐스트와 스크립트 저장 디렉토리 생성
        os.makedirs(self.podcast_dir, exist_ok=True)
        os.makedirs(self.script_dir, exist_ok=True)
        self.logger = logging.getLogger(__name__)

    def create_podcast(self, title: str, content: str) -> str:
        chapter_audio_files = []
        cleaned_title = re.sub(r'[^\w\s-]', '', title.strip())
        cleaned_title = re.sub(r'\s+', '_', cleaned_title)
        try:
            self.logger.info(f"Starting podcast creation for: {title}")
            
            # 1. 스크립트 생성 및 파일 저장
            self.logger.info("Generating scripts for chapters...")
            chapter_scripts = self.script_maker.generate_script(title, content)
            if not chapter_scripts:
                self.logger.error("No scripts were generated")
                raise ContentProcessingException("No scripts generated")
            
            final_script_text = "\n\n".join(chapter_scripts)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            final_script_filename = f"{cleaned_title}_{timestamp}_script.txt"
            final_script_filepath = os.path.join(self.script_dir, final_script_filename)
            self.logger.info(f"Saving final script to {final_script_filepath}")
            with open(final_script_filepath, "w", encoding="utf-8") as f:
                f.write(final_script_text)

            # 2. 각 챕터별 오디오 파일 생성
            self.logger.info(f"Generating audio for {len(chapter_scripts)} chapters...")
            for idx, script in enumerate(chapter_scripts, 1):
                self.logger.info(f"Processing Chapter {idx}")
                chapter_title = f"{title}_Chapter_{idx}"
                audio_path = self.audio_maker.generate_audio(chapter_title, script)
                chapter_audio_files.append(audio_path)

            # 3. 최종 팟캐스트 파일명 생성
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            final_filename = f"{cleaned_title}_{timestamp}_podcast.mp3"
            final_filepath = os.path.join(self.podcast_dir, final_filename)

            # 4. 오디오 파일 병합
            self.logger.info("Merging chapter audio files...")
            self._merge_audio_files(chapter_audio_files, final_filepath)

            # 5. 임시 챕터 파일 삭제
            for file_path in chapter_audio_files:
                if os.path.exists(file_path):
                    os.remove(file_path)
            
            self.logger.info(f"Podcast creation completed successfully for: {title}")
            return final_filepath

        except Exception as e:
            self.logger.error(f"Podcast creation failed: {str(e)}")
            # 에러 발생 시 임시 파일 정리
            for file_path in chapter_audio_files:
                if os.path.exists(file_path):
                    os.remove(file_path)
            raise ContentProcessingException(f"Failed to create podcast: {str(e)}")

    def _merge_audio_files(self, audio_files: List[str], output_path: str):
        try:
            self.logger.info(f"Starting audio merge of {len(audio_files)} files")
            from pydub import AudioSegment
            
            # FFmpeg 경로 설정
            ffmpeg_path = os.getenv("FFMPEG_PATH")
            ffprobe_path = os.getenv("FFPROBE_PATH")
            
            if not os.path.exists(ffmpeg_path) or not os.path.exists(ffprobe_path):
                raise AudioGenerationException("FFmpeg or FFprobe not found. Please check installation.")
            
            AudioSegment.converter = ffmpeg_path
            AudioSegment.ffprobe = ffprobe_path

            # 트랜지션 효과음 로드 (mouse_click 효과음)
            transition_path = "assets/mouse_click.flac"
            if not os.path.exists(transition_path):
                raise AudioGenerationException("Transition sound effect file not found.")
            transition_segment = AudioSegment.from_file(transition_path)

        # 오디오 파일 병합 (각 파일 사이에 트랜지션 효과 삽입)
            combined = AudioSegment.empty()
            total_files = len(audio_files)
            for idx, audio_file in enumerate(audio_files, 1):
                self.logger.info(f"Merging file {idx}/{total_files}")
                segment = AudioSegment.from_mp3(audio_file)
                combined += segment
                # 마지막 파일이 아니라면 트랜지션 효과음 추가
                if idx < total_files:
                    combined += transition_segment

            self.logger.info(f"Exporting final podcast to: {output_path}")
            combined.export(output_path, format="mp3")
            self.logger.info("Audio merge completed successfully")

        except Exception as e:
            self.logger.error(f"Audio merge failed: {str(e)}")
            raise AudioGenerationException(f"Failed to merge audio files: {str(e)}")