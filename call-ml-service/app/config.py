import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

def get_env(name: str, required: bool = True, default=None):
    value = os.getenv(name, default)
    if required and not value:
        raise RuntimeError(f"Missing required env variable: {name}")
    return value

RABBITMQ_URL = get_env("RABBITMQ_URL")
ASSEMBLYAI_API_KEY = get_env("ASSEMBLYAI_API_KEY")
GEMINI_API_KEY = get_env("GEMINI_API_KEY")

CALLS_PROCESSING_QUEUE = get_env("CALLS_PROCESSING_QUEUE")
CALLS_RESULTS_QUEUE = get_env("CALLS_RESULTS_QUEUE")
CALLS_DEAD_LETTER_QUEUE = get_env("DEAD_LETTER_QUEUE")


PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
UPLOADS_DIR = PROJECT_ROOT / "call-node-service"