# conversation-insights-service



A microservices platform for analyzing conversations using Node.js, React, and Python AI services.

---

## 🏗 System Architecture

| Service Name          | Tech Stack                     | Port       | Responsibility                                                                |
| --------------------- | ------------------------------ | ---------- | ----------------------------------------------------------------------------- |
| call-node-service     | Node.js (Express + TypeScript) | 3000       | Core backend orchestration, REST API, database CRUD, RabbitMQ messaging       |
| call-ml-service       | Python                |        | AI service for conversation analysis using Assembly AI & Google Gemini models |
| call-frontend-service | React (TypeScript + Vite)      | 4173       | User dashboard consuming backend APIs                                         |
| PostgreSQL            | PostgreSQL                   | 5432       | Relational database for structured call data                                  |
| RabbitMQ              | RabbitMQ 3-management          | 5672/15672 | Message broker for async processing                                           |

---

## Environment Variables

### call-node-service `.env`

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=call_user
DB_PASSWORD=call_pass
DB_NAME=call_analysis

FRONTEND_URL=http://localhost:5173

RABBITMQ_URL=amqp://localhost

CALLS_PROCESSING_QUEUE=calls_processing_queue
CALLS_RESULTS_QUEUE=calls_results_queue
DEAD_LETTER_QUEUE=calls_dead_letter_queue
CALLS_UPLOAD_QUEUE=calls_upload_queue

CLOUD_NAME=cloudinary_cloud_name
API_KEY=cloudinary_api_key
API_SECRET=cloudinary_api_secret
```

### call-ml-service `.env`

```env
RABBITMQ_URL=amqp://localhost

ASSEMBLYAI_API_KEY=assembly_api_key
GEMINI_API_KEY=gemini_api_key

CALLS_PROCESSING_QUEUE=calls_processing_queue
CALLS_RESULTS_QUEUE=calls_results_queue
DEAD_LETTER_QUEUE=calls_dead_letter_queue
```

### call-frontend-service `.env`

```env
VITE_API_URL=http://localhost:3000/api
```


---

## 🚀 Quick Start: Infrastructure (Docker Compose)


**Commands:**

```bash
docker compose -f docker-compose.yaml up -d
docker ps  # Verify services
```

---

## Database Migrations

1. Enter the Postgres container:

```bash
docker exec -it <postgres-container-id> psql -U postgres -d call_analysis
```

2. Run migrations in order to make sure all required TABLES exists:

```sql
/migrations/001_create_calls_table.sql
/migrations/002_create_calls_analysis_table.sql
```

---

## Service Setup Order & Instructions

### 1. call-node-service

**Directory:** `./call-node-service`

```bash
npm install
npm run build
npm start
# Server URL: http://localhost:3000
```

### 2. call-ml-service

**Directory:** `./call-ml-service`

```bash
python -m venv venv
# Activate venv
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

### 3. call-frontend-service

**Directory:** `./call-frontend-service`

```bash
npm install
npm run build
npm start
# App URL: http://localhost:4173
```

---


## Troubleshooting & Common Commands

```bash
docker compose -f docker-compose.yaml logs 
curl http://localhost:3000/api/health
```

---

## Repository Structure

```
/conversation-insights-service
├─ call-node-service/
├──├──migrations/
│     ├─ 001_create_calls_table.sql
│     └─ 002_create_calls_analysis_table.sql
├─ call-ml-service/
├─ call-frontend-service/
├─ docker-compose.yaml
└─ README.md
```
