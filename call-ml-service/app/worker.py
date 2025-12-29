import json
import logging
from app.rabbitmq import (
    channel,
    publish_result,
    CALLS_PROCESSING_QUEUE,
    CALLS_DEAD_LETTER_QUEUE,
    CALLS_RESULTS_QUEUE
)
from app.services import transcribe
from app.services import analyze_transcript


def call_processing_worker(ch, method, properties, body):
    call_id = None
    
    try:
        job = json.loads(body.decode("utf-8"))
        call_id = job["id"]
        audio_path = job["audioUrl"]

        logging.info(f"Processing call_id={call_id}")

        payload = transcribe(call_id, audio_path)
        
        result = analyze_transcript(call_id, payload)
        
        call_analytics = {
            "duration_seconds": payload.get("duration_seconds", 0),
            "transcript": payload.get("transcript", {}),
            "analysis": result,
        }
        publish_result({
            "callId": call_id,
            "callAnalytics": call_analytics,
        }, CALLS_RESULTS_QUEUE)
        
        print(json.dumps(result, indent=2))
        
        ch.basic_ack(delivery_tag=method.delivery_tag)
        logging.info(f"Completed call_id={call_id}")

    except Exception as e:
        logging.exception(f"Error processing call_id={call_id}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

        try:
            publish_result({"call_id": call_id, "error": str(e)}, CALLS_DEAD_LETTER_QUEUE)
        except Exception:
            logging.exception("Failed to publish to DLQ")


def start_worker():
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=CALLS_PROCESSING_QUEUE, on_message_callback=call_processing_worker)
    logging.info("Worker listening...")
    channel.start_consuming()