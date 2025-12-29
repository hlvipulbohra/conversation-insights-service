import os
import logging
import assemblyai as aai
from app.config import ASSEMBLYAI_API_KEY, UPLOADS_DIR

logging.basicConfig(level=logging.INFO)
logging.getLogger("assemblyai").setLevel(logging.ERROR)
logging.getLogger("httpx").setLevel(logging.ERROR)

aai.settings.api_key = ASSEMBLYAI_API_KEY

config = aai.TranscriptionConfig(
    speech_models=["universal"],
    sentiment_analysis=True,
    speaker_labels=True,
)

def transcribe(call_id: str, audio_path: str) -> dict:
    try:
        # file_path = str(UPLOADS_DIR / audio_path)

        # if not os.path.exists(file_path):
        #     raise FileNotFoundError(f"Audio file not found: {file_path}")

        logging.info(f"Transcribing call_id={call_id}")

        transcriber = aai.Transcriber(config=config)
        transcript = transcriber.transcribe(audio_path)

        if transcript.status == "error":
            raise RuntimeError(transcript.error)

        logging.info(f"Transcription completed for call_id={call_id}")
        conversation = attach_sentiment(transcript)

        return {
            "duration_seconds": getattr(transcript, "audio_duration", 0),
            "transcript": conversation,
        }

    except Exception:
        logging.exception(f"Transcription failed call_id={call_id}")
        raise


def attach_sentiment(transcript):
    utterances = transcript.utterances or []
    sentiments = transcript.sentiment_analysis or []

    enriched = []

    for utt in utterances:
        related = [s for s in sentiments if not (s.end < utt.start or s.start > utt.end)]

        if related:
            top = max(related, key=lambda s: s.confidence)
            sentiment_value = getattr(top.sentiment, "value", str(top.sentiment))
            confidence_value = float(top.confidence)
        else:
            sentiment_value = "UNKNOWN"
            confidence_value = None

        enriched.append({
            "speaker": "Agent" if getattr(utt, "speaker", "C") == "A" else "Customer",
            "text": utt.text,
            "start": utt.start,
            "end": utt.end,
            "sentiment": sentiment_value,
            "confidence": confidence_value
        })

    return enriched
