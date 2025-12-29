
---

```markdown
# Call ML Service

Python-based AI/ML service for conversation analysis using Assembly AI and Google Gemini models.

---

## 🧰 Prerequisites

- Python 3
- RabbitMQ running
- Virtual Environment (recommended)

---

## ⚙ Environment Variables

Create a `.env` file in this directory:

```env
RABBITMQ_URL=amqp://localhost

ASSEMBLYAI_API_KEY=assembly_api_key
GEMINI_API_KEY=gemini_api_key

CALLS_PROCESSING_QUEUE=calls_processing_queue
CALLS_RESULTS_QUEUE=calls_results_queue
DEAD_LETTER_QUEUE=calls_dead_letter_queue

🏃 Commands to run the service
python -m venv venv
# Activate virtual environment
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python -m app.main
