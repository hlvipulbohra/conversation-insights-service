import json
import logging
import time
import pika
from pika.adapters.blocking_connection import BlockingChannel
from app.config import (
    RABBITMQ_URL,
    CALLS_PROCESSING_QUEUE,
    CALLS_RESULTS_QUEUE,
    CALLS_DEAD_LETTER_QUEUE,
)


connection = None
channel: BlockingChannel | None = None


def connect_with_retry(max_retries=10):
    global connection, channel

    attempt = 0
    while True:
        try:
            logging.info("Connecting to RabbitMQ...")
            params = pika.URLParameters(RABBITMQ_URL)
            connection = pika.BlockingConnection(params)
            channel = connection.channel()

            # Main queues
            channel.queue_declare(queue=CALLS_PROCESSING_QUEUE, durable=True)
            channel.queue_declare(queue=CALLS_RESULTS_QUEUE, durable=True)

            # DLQ
            channel.queue_declare(queue=CALLS_DEAD_LETTER_QUEUE, durable=True)

            # Ensure unacked messages survive crashes
            channel.basic_qos(prefetch_count=1)

            logging.info("RabbitMQ connected successfully.")
            return

        except Exception as e:
            attempt += 1
            logging.error(f"RabbitMQ connection failed: {e} | retry in 5s")

            if attempt >= max_retries:
                raise RuntimeError("RabbitMQ failed after retries")

            time.sleep(5) # wait for 5 seconds before retry


def ensure_connection():
    global connection
    if connection is None or connection.is_closed:
        connect_with_retry()


def publish_result(payload: dict, queue_name: str):
    ensure_connection()

    try:
        body = json.dumps(payload).encode("utf-8")
        channel.basic_publish(
            exchange="",
            routing_key=queue_name,
            body=body,
            properties=pika.BasicProperties(delivery_mode=2),
            mandatory=False,
        )

        logging.info(f"Published to queue={queue_name} payload_size={len(body)}")

    except Exception:
        logging.exception(f"Failed publishing to {queue_name}")
        raise


# Initialize at module import safely
connect_with_retry()
