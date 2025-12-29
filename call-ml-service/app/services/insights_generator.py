import json
import logging
from google import genai
from pydantic import ValidationError
from app.config import GEMINI_API_KEY
from app.models.call_insights import CallInsights

# logging.basicConfig(level=logging.INFO)

client = genai.Client(api_key=GEMINI_API_KEY)

def build_prompt(payload):
    return f"""
    You are a VP of Product, whose job is to identify the below from customer support conversations:
    
    1. Where are the agents failing?
    2. What are the customers complaining about?
    3. How was the overall customer experience?
    
    Return ONLY valid JSON matching schema. No markdown.

    Input JSON includes:
    - call_id
    - duration_ms
    - conversation[] = speaker, text, timestamps, sentiment, confidence

    RULES:
    - Use only facts from JSON
    - Prefer objective reasoning
    - If uncertain, explicitly mark "unknown"
    - Be deterministic
    - Output MUST be strict JSON
    INPUT:
    {json.dumps(payload, indent=2)}
    """

def analyze_transcript(call_id: str, payload: dict) -> dict:
    try:
        prompt = build_prompt(payload)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_json_schema": CallInsights.model_json_schema(),
            },
        )

        text = (response.text or "").strip()

        # remove fences if Gemini adds markdown
        text = text.replace("```json", "").replace("```", "").strip()

        data = json.loads(text)

        validated = CallInsights(**data).model_dump()

        logging.info(f"Insights generated call_id={call_id}")
        return validated

    except (json.JSONDecodeError, ValidationError) as e:
        logging.exception("Gemini returned invalid JSON")
        raise

    except Exception:
        logging.exception(f"Gemini processing failed call_id={call_id}")
        raise
