# Call Node Service

The core backend orchestration service for Conversation Insights, built with
Node.js, Express, and TypeScript. Handles API requests, database CRUD, and
messaging via RabbitMQ.

---

## 🧰 Prerequisites

- Node.js v18+
- PostgreSQL running
- RabbitMQ running
- npm or yarn

---

## ⚙ Environment Variables

Create a `.env` file in this directory:

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

🏃 Development
npm install
npm run dev

Runs the backend in development mode.

API accessible at: http://localhost:3000

Check health endpoint:
curl http://localhost:3000/api/health



📦 Production
npm install
npm run build
npm start
```
